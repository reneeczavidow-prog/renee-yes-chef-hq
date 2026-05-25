const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function getTasks() {
  const r = await fetch(`${BASE}/api/tasks`);
  return r.json();
}

export async function createTask(data) {
  const r = await fetch(`${BASE}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return r.json();
}

export async function updateTask(id, data) {
  const r = await fetch(`${BASE}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return r.json();
}

export async function getMeetings() {
  const r = await fetch(`${BASE}/api/meetings`);
  return r.json();
}

export async function markMeetingTriaged(id) {
  const r = await fetch(`${BASE}/api/meetings/${id}/triage`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });
  return r.json();
}
