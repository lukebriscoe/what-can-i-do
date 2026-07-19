// One-object backup: because the whole app is a single serialisable state
// document, export/import is trivial and fully portable between devices.

export function exportState(state) {
  const payload = {
    app: 'what-can-i-do',
    exportedAt: new Date().toISOString(),
    version: state.meta?.version || 1,
    state,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `what-can-i-do-backup-${stamp}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function importStateFromFile(file) {
  const text = await file.text()
  const parsed = JSON.parse(text)
  const state = parsed.state || parsed // tolerate a bare state object too
  if (!state || !state.settings || !state.days) {
    throw new Error('That doesn’t look like a What Can I Do? backup.')
  }
  return state
}
