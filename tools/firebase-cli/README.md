# Local emulator toolchain

Install from the lockfile with `npm ci --prefix tools/firebase-cli --ignore-scripts` at the repository root. Node 24 and Java 21 are the verified environment. The application/browser dependencies are unchanged.

`tools/test-rules-local.mjs` and `tools/test-auth-integration-local.mjs` execute this private CLI installation directly with Node. They accept no arguments and can only start fixed loopback demo suites. They never fall back to the existing global `firebase` command or perform deployment.

Firebase CLI remains 15.34.0. The local dependency overrides remove three previously measured advisory paths:

| Override | Purpose |
|---|---|
| chokidar 4.0.3 | Removes the braces glob-parser path; the emulator watches exact rules filenames. |
| uuid 11.1.1 | Includes the buffer-bound checks while preserving the CommonJS API used by this CLI tree. |
| @google-cloud/pubsub 6.3.0 | Uses the updated OpenTelemetry core dependency line instead of overriding core beneath incompatible parents. |

`node tools/test-tooling.mjs` checks the pinned tree, absence of braces, UUID buffer rejection, no npm invalid entries, guarded entry points and an actual rules-file watcher update. Firestore/Storage/Auth emulator suites verify the CLI execution path. Cloud Pub/Sub, deployment and other CLI features are outside this local toolchain's verified scope. The old global installation is preserved for recovery/other projects and is not repaired or selected by these runners.

The dependency collector measured zero known advisories for the one direct dependency and 560 registry-verified transitive package/version pairs in the lock on 2026-10-20. That is a version-matched advisory result, not a guarantee about all supply-chain criteria. Install scripts remain disabled. Reassess the lock and rerun the suites before changing an override.
