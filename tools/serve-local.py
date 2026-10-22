"""Serve only tracked public assets; never expose backup files or private documents."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from subprocess import check_output
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = set(check_output(["git", "-C", str(ROOT), "ls-files", "-z"]).decode().split("\0"))
EXTENSIONS = {".html", ".js", ".css", ".json", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".ico", ".woff", ".woff2"}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        path = unquote(urlsplit(self.path).path).lstrip("/") or "index.html"
        target = (ROOT / path).resolve()
        if (
            path not in PUBLIC
            or not target.is_relative_to(ROOT)
            or path.startswith(("tools/", "functions/", "backups/", ".", "private/", "secrets/"))
            or path in {"firebase.local.json", "firestore.indexes.json"}
            or target.suffix.lower() not in EXTENSIONS
        ):
            self.send_error(404)
            return
        super().do_GET()

    def do_HEAD(self):
        self.send_error(405)


if __name__ == "__main__":
    print("CODE LAB: http://127.0.0.1:8000 (public assets only)", flush=True)
    ThreadingHTTPServer(("127.0.0.1", 8000), Handler).serve_forever()
