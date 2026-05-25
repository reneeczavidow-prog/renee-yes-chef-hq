import { useState } from 'react';
import { PRIORITIES, PROJECT_LIST } from '../config';

export default function AddTask({ defaultProject, onAdd }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [project, setProject] = useState(defaultProject || 'Food Fest');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('This Week');

  const submit = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), project, priority, status, owner: 'Me' });
    setName('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)',
          background: 'transparent', border: '1px dashed var(--border)',
          color: 'var(--text-3)', fontSize: 12, transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.target.style.borderColor = 'var(--border-hover)'; e.target.style.color = 'var(--text-2)'; }}
        onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-3)'; }}
      >
        + add task
      </button>
    );
  }

  return (
    <div style={{
      background: 'var(--bg-3)', borderRadius: 'var(--radius)',
      padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <input
        autoFocus
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') setOpen(false); }}
        placeholder='Task name...'
        style={{
          background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)',
          color: 'var(--text)', padding: '4px 0', width: '100%',
        }}
      />
      <div style={{ display: 'flex', gap: 6 }}>
        <select value={project} onChange={e => setProject(e.target.value)}
          style={{ flex: 1, background: 'var(--bg-4)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', padding: '4px 6px' }}>
          {PROJECT_LIST.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value)}
          style={{ background: 'var(--bg-4)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', padding: '4px 6px' }}>
          {PRIORITIES.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)}
          style={{ background: 'var(--bg-4)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', padding: '4px 6px' }}>
          <option>This Week</option>
          <option>Next Week</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={submit} style={{
          flex: 1, padding: '0.5rem', borderRadius: 6,
          background: 'var(--text)', color: 'var(--bg)', fontSize: 12, fontWeight: 500,
        }}>
          Add
        </button>
        <button onClick={() => setOpen(false)} style={{
          padding: '0.5rem 0.75rem', borderRadius: 6,
          background: 'var(--bg-4)', color: 'var(--text-2)', fontSize: 12,
        }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
