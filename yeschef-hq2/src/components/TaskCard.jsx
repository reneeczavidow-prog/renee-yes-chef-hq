import { PROJECTS } from '../config';

const PRIORITY_COLOR = { High: 'var(--high)', Medium: 'var(--med)', Low: 'var(--low)' };

export default function TaskCard({ task, onStatusChange, onFlipToMe }) {
  const proj = PROJECTS[task.project] || PROJECTS['General Ops'];
  const isDone = task.status === 'Done';
  const isWaiting = task.owner !== 'Me';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '0.75rem 1rem',
      background: 'var(--bg-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      transition: 'border-color 0.15s',
      opacity: isDone ? 0.5 : 1,
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div
        onClick={() => onStatusChange(task.id, isDone ? 'This Week' : 'Done')}
        style={{
          width: 18, height: 18, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
          border: isDone ? 'none' : `1.5px solid var(--border-hover)`,
          background: isDone ? 'var(--rc)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
        }}
      >
        {isDone && <span style={{ color: '#000', fontSize: 10, fontWeight: 700 }}>✓</span>}
      </div>

      <span style={{
        flex: 1, fontSize: 13, color: isDone ? 'var(--text-3)' : 'var(--text)',
        textDecoration: isDone ? 'line-through' : 'none',
      }}>
        {task.name}
      </span>

      {isWaiting && (
        <span
          onClick={() => onFlipToMe && onFlipToMe(task.id)}
          style={{
            fontSize: 10, color: 'var(--tg)', background: 'var(--tg-bg)',
            padding: '2px 8px', borderRadius: 20, cursor: 'pointer', flexShrink: 0,
          }}
          title='Flip back to me'
        >
          → {task.owner}
        </span>
      )}

      <span style={{
        fontSize: 10, padding: '2px 8px', borderRadius: 20, flexShrink: 0,
        background: proj.bg, color: proj.color,
      }}>
        {task.project}
      </span>

      <span style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        background: PRIORITY_COLOR[task.priority] || 'var(--low)',
      }} title={task.priority} />
    </div>
  );
}
