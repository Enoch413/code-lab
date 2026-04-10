#!/usr/bin/env python3
from __future__ import annotations

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path

import firebase_admin
from firebase_admin import auth, credentials, firestore


DEFAULT_DOMAIN = "prep.local"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Update a Firebase Auth user and matching Firestore users doc."
    )
    parser.add_argument(
        "--service-account",
        required=True,
        help="Path to Firebase service account JSON file.",
    )
    parser.add_argument(
        "--login-id",
        help="Current login ID to find the user. Example: msu7563",
    )
    parser.add_argument(
        "--uid",
        help="Firebase Auth UID. Use this instead of --login-id if you already know it.",
    )
    parser.add_argument(
        "--domain",
        default=DEFAULT_DOMAIN,
        help=f"Internal login domain. Default: {DEFAULT_DOMAIN}",
    )
    parser.add_argument("--new-login-id", help="New login ID.")
    parser.add_argument("--name", help="New display name.")
    parser.add_argument("--student-id", help="New studentId field value.")
    parser.add_argument(
        "--class-ids",
        help="Class IDs separated by | , or ;  Example: class-1-gangseo-b|class-1-seonbu",
    )
    parser.add_argument(
        "--role",
        choices=["student", "admin"],
        help="New role value.",
    )
    parser.add_argument(
        "--admin-scope",
        choices=["assigned", "all"],
        help="Admin scope. Use all for a superadmin-style account.",
    )
    parser.add_argument(
        "--allowed-labs",
        help="Optional visible TOOLS LAB list separated by | , or ;  Example: word-lab|builder-lab . Use all to allow every LAB, or an empty string for none.",
    )
    parser.add_argument(
        "--password-reset-required",
        help="true or false. Controls the forced password-change flag.",
    )
    parser.add_argument(
        "--new-password",
        help="If set, updates the Firebase Auth password.",
    )
    parser.add_argument(
        "--disabled",
        help="true or false. Disables or enables Firebase Auth login for this user.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would change without writing to Firebase.",
    )
    return parser.parse_args()


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def parse_optional_bool(value: str | None) -> bool | None:
    if value is None:
        return None
    raw = str(value).strip().lower()
    if raw in {"1", "true", "t", "yes", "y", "on"}:
        return True
    if raw in {"0", "false", "f", "no", "n", "off"}:
        return False
    raise ValueError(f"Cannot parse boolean value: {value!r}")


def parse_class_ids(value: str | None) -> list[str] | None:
    if value is None:
        return None
    raw = str(value).strip()
    if raw == "":
        return []
    tokens: list[str] = []
    for chunk in raw.replace(",", "|").replace(";", "|").split("|"):
        item = chunk.strip()
        if item:
            tokens.append(item)
    seen: set[str] = set()
    ordered: list[str] = []
    for item in tokens:
        if item not in seen:
            seen.add(item)
            ordered.append(item)
    return ordered


def parse_allowed_labs(value: str | None) -> list[str] | None:
    if value is None:
        return None
    raw = str(value).strip()
    if raw == "":
        return []
    tokens: list[str] = []
    for chunk in raw.replace(",", "|").replace(";", "|").split("|"):
        item = chunk.strip()
        if item:
            tokens.append(item)
    seen: set[str] = set()
    ordered: list[str] = []
    for item in tokens:
        lowered = item.lower()
        if lowered == "all":
            return ["all"]
        if lowered not in seen:
            seen.add(lowered)
            ordered.append(item)
    return ordered


def to_internal_email(login_id: str, domain: str) -> str:
    return f"{login_id}@{domain}".lower()


def initialize_firebase(service_account_path: Path) -> firestore.Client:
    if not firebase_admin._apps:
        cred = credentials.Certificate(str(service_account_path))
        firebase_admin.initialize_app(cred)
    return firestore.client()


def resolve_uid(
    db: firestore.Client,
    login_id: str | None,
    uid: str | None,
    domain: str,
) -> str:
    if uid:
        return uid
    if not login_id:
        raise ValueError("Either --login-id or --uid is required.")

    docs = list(db.collection("users").where("loginId", "==", login_id).stream())
    if len(docs) == 1:
        return docs[0].id
    if len(docs) > 1:
        raise ValueError(f"Multiple users docs found for loginId={login_id!r}")

    email = to_internal_email(login_id, domain)
    try:
        user = auth.get_user_by_email(email)
        return user.uid
    except auth.UserNotFoundError as exc:
        raise ValueError(f"User not found for loginId={login_id!r}") from exc


def main() -> int:
    args = parse_args()
    service_account_path = Path(args.service_account).expanduser().resolve()
    if not service_account_path.exists():
        print(f"Service account file not found: {service_account_path}", file=sys.stderr)
        return 1

    if args.new_password and len(args.new_password) < 6:
        print("ERROR: --new-password must be at least 6 characters.", file=sys.stderr)
        return 1

    try:
        db = initialize_firebase(service_account_path)
        uid = resolve_uid(db, args.login_id, args.uid, args.domain.strip() or DEFAULT_DOMAIN)

        try:
            auth_user = auth.get_user(uid)
        except auth.UserNotFoundError as exc:
            raise ValueError(f"Auth user not found for uid={uid}") from exc

        doc_ref = db.collection("users").document(uid)
        doc_snapshot = doc_ref.get()
        existing_doc = doc_snapshot.to_dict() if doc_snapshot.exists else {}

        current_login_id = existing_doc.get("loginId") or args.login_id
        if not current_login_id:
            current_login_id = auth_user.email.split("@", 1)[0] if auth_user.email else uid

        target_login_id = (args.new_login_id or current_login_id).strip()
        target_email = to_internal_email(target_login_id, args.domain.strip() or DEFAULT_DOMAIN)
        target_name = (args.name or existing_doc.get("name") or auth_user.display_name or "").strip()
        target_student_id = (
            (args.student_id or "").strip()
            or str(existing_doc.get("studentId") or current_login_id).strip()
        )
        target_class_ids = parse_class_ids(args.class_ids)
        if target_class_ids is None:
            target_class_ids = list(existing_doc.get("classIds") or [])
        target_role = args.role or str(existing_doc.get("role") or "student").strip().lower()
        target_admin_scope = str(args.admin_scope or existing_doc.get("adminScope") or "assigned").strip().lower() or "assigned"
        if target_role != "admin":
            target_admin_scope = "assigned"
        target_allowed_labs = parse_allowed_labs(args.allowed_labs)
        if target_allowed_labs is None and isinstance(existing_doc.get("allowedLabs"), list):
            target_allowed_labs = parse_allowed_labs("|".join(str(item).strip() for item in existing_doc.get("allowedLabs") if str(item).strip()))
        target_reset_required = parse_optional_bool(args.password_reset_required)
        if target_reset_required is None:
            target_reset_required = bool(existing_doc.get("passwordResetRequired", True))
        target_disabled = parse_optional_bool(args.disabled)
        if target_disabled is None:
            target_disabled = bool(getattr(auth_user, "disabled", False))

        if target_email != (auth_user.email or "").lower():
            try:
                existing_email_user = auth.get_user_by_email(target_email)
            except auth.UserNotFoundError:
                existing_email_user = None
            if existing_email_user and existing_email_user.uid != uid:
                raise ValueError(f"Another auth user already uses email {target_email}")

        auth_updates: dict[str, str] = {}
        if target_email != (auth_user.email or "").lower():
            auth_updates["email"] = target_email
        if target_name and target_name != (auth_user.display_name or ""):
            auth_updates["display_name"] = target_name
        if args.new_password:
            auth_updates["password"] = args.new_password
        if target_disabled != bool(getattr(auth_user, "disabled", False)):
            auth_updates["disabled"] = target_disabled

        user_doc = {
            "loginId": target_login_id,
            "email": target_email,
            "name": target_name,
            "studentId": target_student_id,
            "classIds": target_class_ids,
            "role": target_role,
            "adminScope": target_admin_scope,
            "passwordResetRequired": target_reset_required,
            "loginDisabled": target_disabled,
            "createdAt": existing_doc.get("createdAt", now_iso()),
            "updatedAt": now_iso(),
        }
        if target_allowed_labs is not None:
            user_doc["allowedLabs"] = target_allowed_labs

        print(f"UID={uid}")
        print(f"CURRENT_LOGIN_ID={current_login_id}")
        print(f"TARGET_LOGIN_ID={target_login_id}")
        print(f"TARGET_EMAIL={target_email}")
        print(f"TARGET_NAME={target_name}")
        print(f"TARGET_STUDENT_ID={target_student_id}")
        print(f"TARGET_CLASS_IDS={'|'.join(target_class_ids)}")
        print(f"TARGET_ROLE={target_role}")
        print(f"TARGET_ADMIN_SCOPE={target_admin_scope}")
        print(f"TARGET_ALLOWED_LABS={'|'.join(target_allowed_labs) if target_allowed_labs is not None else 'unchanged'}")
        print(f"PASSWORD_RESET_REQUIRED={str(target_reset_required).lower()}")
        print(f"LOGIN_DISABLED={str(target_disabled).lower()}")
        print(f"AUTH_UPDATES={','.join(sorted(auth_updates.keys())) if auth_updates else 'none'}")

        if args.dry_run:
            print("[DRY RUN] No changes were written.")
            return 0

        if auth_updates:
            auth.update_user(uid, **auth_updates)
        doc_ref.set(user_doc, merge=True)

        print("[DONE] User updated successfully.")
        return 0
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
