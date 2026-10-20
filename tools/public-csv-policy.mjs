import assert from 'node:assert/strict'

const templatePath = 'tools/firebase_bulk_users_template.csv'
const header = '"loginId","name","studentId","classIds","allowedLabs","initialPassword","role","adminScope","passwordResetRequired"'

export function assertPublicCsv(tracked, template) {
  assert.ok(tracked.includes(templatePath), 'Required CSV template missing; contents withheld')
  assert.ok(tracked.every(name => !/\.csv$/i.test(name) || name === templatePath), 'Tracked CSV is not allowed; contents withheld')
  assert.ok(template.trim() === header, 'Publish only the expected CSV header; contents withheld')
}
