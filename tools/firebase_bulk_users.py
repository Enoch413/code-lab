#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

import firebase_admin
from firebase_admin import auth, credentials, firestore


DEFAULT_DOMAIN = "prep.local"


@dataclass
class UserRow:
    login_id: str
    name: str
    student_id: str
    class_ids: list[str]
    allowed_labs: list[str] | None
    initial_password: str
    role: str
    admin_scope: str
    password_reset_required: bool
    email: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create or update Firebase Auth users and Firestore users docs from CSV."
    )
    parser.add_argument("--csv", required=True, help="Path to CSV file.")
    parser.add_argument(
        "--service-account",
        required=True,
        help="Path to Firebase service account JSON file.",
    )
    parser.add_argument(
        "--domain",
        default=DEFAULT_DOMAIN,
        help=f"Internal login domain. Default: {DEFAULT_DOMAIN}",
    )
    parser.add_argument(
        "--update-passwords",
        action="store_true",
        help="Update existing Auth user passwords from the CSV initialPassword column.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate rows and show what would happen without writing to Firebase.",
    )
    return parser.parse_args()


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def parse_bool(value: str | None, default: bool = True) -> bool:
    if value is None:
        return default
    raw = str(value).strip().lower()
    if raw == "":
        return default
    if raw in {"1", "true", "t", "yes", "y", "on"}:
        return True
    if raw in {"0", "false", "f", "no", "n", "off"}:
        return False
    raise ValueError(f"Cannot parse boolean value: {value!r}")


def parse_class_ids(value: str | None) -> list[str]:
    if value is None:
        return []
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
        return None
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


def normalize_role(value: str | None) -> str:
    role = str(value or "student").strip().lower() or "student"
    if role not in {"student", "admin"}:
        raise ValueError(f"role must be student or admin, got {value!r}")
    return role


def normalize_admin_scope(value: str | None, role: str) -> str:
    if role != "admin":
        return "assigned"
    scope = str(value or "assigned").strip().lower() or "assigned"
    if scope not in {"assigned", "all"}:
        raise ValueError(f"adminScope must be assigned or all, got {value!r}")
    return scope


def to_internal_email(login_id: str, domain: str) -> str:
    return f"{login_id}@{domain}".lower()


def normalize_row(raw_row: dict[str, str], domain: str, row_number: int) -> UserRow:
    login_id = str(raw_row.get("loginId", "")).strip()
    if not login_id:
        raise ValueError(f"row {row_number}: loginId is required")

    name = str(raw_row.get("name", "")).strip()
    if not name:
        raise ValueError(f"row {row_number}: name is required")

    student_id = str(raw_row.get("studentId", "")).strip() or login_id
    class_ids = parse_class_ids(raw_row.get("classIds"))
    allowed_labs = parse_allowed_labs(raw_row.get("allowedLabs"))
    role = normalize_role(raw_row.get("role"))
    admin_scope = normalize_admin_scope(raw_row.get("adminScope"), role)
    password_reset_required = parse_bool(raw_row.get("passwordResetRequired"), default=True)
    initial_password = str(raw_row.get("initialPassword", "")).strip()
    email = str(raw_row.get("email", "")).strip().lower() or to_internal_email(login_id, domain)

    if len(initial_password) < 6:
        raise ValueError(f"row {row_number}: initialPassword must be at least 6 characters")

    return UserRow(
        login_id=login_id,
        name=name,
        student_id=student_id,
        class_ids=class_ids,
        allowed_labs=allowed_labs,
        initial_password=initial_password,
        role=role,
        admin_scope=admin_scope,
        password_reset_required=password_reset_required,
        email=email,
    )


def load_rows(csv_path: Path, domain: str) -> list[UserRow]:
    with csv_path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        required = {"loginId", "name", "studentId", "classIds", "initialPassword", "role", "passwordResetRequired"}
        missing = required.difference(reader.fieldnames or [])
        if missing:
            raise ValueError(f"CSV is missing required columns: {', '.join(sorted(missing))}")

        rows: list[UserRow] = []
        for index, raw_row in enumerate(reader, start=2):
            if not any(str(value or "").strip() for value in raw_row.values()):
                continue
            rows.append(normalize_row(raw_row, domain, index))
        return rows


def initialize_firebase(service_account_path: Path) -> firestore.Client:
    if not firebase_admin._apps:
        cred = credentials.Certificate(str(service_account_path))
        firebase_admin.initialize_app(cred)
    return firestore.client()


def ensure_auth_user(row: UserRow, update_passwords: bool, dry_run: bool) -> tuple[str, bool]:
    try:
        existing_user = auth.get_user_by_email(row.email)
        if dry_run:
            return existing_user.uid, False

        update_kwargs: dict[str, str] = {"display_name": row.name}
        if update_passwords:
            update_kwargs["password"] = row.initial_password
        if update_kwargs:
            auth.update_user(existing_user.uid, **update_kwargs)
        return existing_user.uid, False
    except auth.UserNotFoundError:
        if dry_run:
            return "<new-user>", True
        created_user = auth.create_user(
            email=row.email,
            password=row.initial_password,
            display_name=row.name,
        )
        return created_user.uid, True


def build_user_doc(row: UserRow, uid: str, existing_doc: dict | None) -> dict:
    current_timestamp = now_iso()
    return {
        "loginId": row.login_id,
        "email": row.email,
        "name": row.name,
        "studentId": row.student_id,
        "classIds": row.class_ids,
        "allowedLabs": (
            row.allowed_labs
            if row.allowed_labs is not None
            else (existing_doc or {}).get("allowedLabs")
        ),
        "role": row.role,
        "adminScope": row.admin_scope,
        "passwordResetRequired": (
            row.password_reset_required
            if row.password_reset_required is not None
            else bool((existing_doc or {}).get("passwordResetRequired", True))
        ),
        "createdAt": (existing_doc or {}).get("createdAt", current_timestamp),
        "updatedAt": current_timestamp,
    }


def upsert_user_doc(db: firestore.Client, row: UserRow, uid: str, dry_run: bool) -> str:
    doc_ref = db.collection("users").document(uid)
    snapshot = None if dry_run else doc_ref.get()
    existing_doc = snapshot.to_dict() if snapshot and snapshot.exists else None
    payload = build_user_doc(row, uid, existing_doc)

    if dry_run:
        return "would-write"

    doc_ref.set(payload, merge=True)
    return "created" if existing_doc is None else "updated"


def print_summary(created_auth: int, existing_auth: int, created_docs: int, updated_docs: int, dry_run: bool) -> None:
    mode = "DRY RUN" if dry_run else "DONE"
    print("")
    print(f"[{mode}] Firebase bulk user sync finished.")
    print(f"- Auth created: {created_auth}")
    print(f"- Auth existing: {existing_auth}")
    print(f"- Firestore docs created: {created_docs}")
    print(f"- Firestore docs updated: {updated_docs}")


def process_rows(rows: Iterable[UserRow], db: firestore.Client, update_passwords: bool, dry_run: bool) -> None:
    created_auth = 0
    existing_auth = 0
    created_docs = 0
    updated_docs = 0

    for row in rows:
        uid, created = ensure_auth_user(row, update_passwords=update_passwords, dry_run=dry_run)
        if created:
            created_auth += 1
        else:
            existing_auth += 1

        doc_status = upsert_user_doc(db, row, uid, dry_run=dry_run)
        if doc_status == "created":
            created_docs += 1
        else:
            updated_docs += 1

        print(f"- {row.login_id} -> {uid} ({'new-auth' if created else 'existing-auth'}, {doc_status})")

    print_summary(created_auth, existing_auth, created_docs, updated_docs, dry_run)


def main() -> int:
    args = parse_args()
    csv_path = Path(args.csv).expanduser().resolve()
    service_account_path = Path(args.service_account).expanduser().resolve()

    if not csv_path.exists():
        print(f"CSV file not found: {csv_path}", file=sys.stderr)
        return 1
    if not service_account_path.exists():
        print(f"Service account file not found: {service_account_path}", file=sys.stderr)
        return 1

    try:
        rows = load_rows(csv_path, args.domain.strip() or DEFAULT_DOMAIN)
        if not rows:
            print("CSV has no user rows to process.", file=sys.stderr)
            return 1

        db = initialize_firebase(service_account_path)
        process_rows(rows, db, update_passwords=args.update_passwords, dry_run=args.dry_run)
        return 0
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
