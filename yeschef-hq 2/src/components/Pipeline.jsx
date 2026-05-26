import TaskCard from './TaskCard';

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };
const STATUS_ORDER = { 'This Week': 0, 'Next Week': 1, 'Unlabeled': 2, Done: 3 };

export default function Pipeline({ tasks, onStatusChange }) {
  const sorted = [...tasks]
    .filter(t => t.owner === 'Me')
    .sort((a, b) => {
      const s = (STATUS_ORDER[a.status] || 2) - (STATUS_ORDER[b.status] || 2);
      if (s !== 0) return s;
      return (PRIORITY_ORDER[a.priority] || 2) - (PRIORITY_ORDER[b.priority] || 2);
    });

  const active = sorted.filter(t => t.status !== 'Done');
  const done = sorted.filter(t => t.status === 'Done');

  return (
    <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
        All tasks — sorted by urgency
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: '1.5rem' }}>
        {active.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
            <div style={{
              width: 3, borderRadius: '4px 0 0 4px', flexShrink: 0,
              background: t.priority === 'High' ? 'var(--high)' : t.priority === 'Medium' ? 'var(--med)' : 'var(--low)',
            }} />
            <div style={{ flex: 1 }}>
              <TaskCard task={t} onStatusChange={onStatusChange} />
            </div>
          </div>
        ))}
      </div>

      {done.length > 0 && (
        <details>
          <summary style={{ fontSize: 11, color: 'var(--text-3)', cursor: 'pointer', listStyle: 'none', marginBottom: 8 }}>
            {done.length} completed ›
          </summary>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {done.map(t => (
              <TaskCard key={t.id} task={t} onStatusChange={onStatusChange} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
