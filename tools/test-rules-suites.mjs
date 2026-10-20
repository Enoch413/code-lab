import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
for (const suite of ['test-firestore-scope.mjs', 'test-storage-scope.mjs']) {
  const result = spawnSync(process.execPath, ['tools/' + suite], { cwd: root, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status || 1)
}
