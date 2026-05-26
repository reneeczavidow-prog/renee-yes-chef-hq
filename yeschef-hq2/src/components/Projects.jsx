import TaskCard from './TaskCard';
import AddTask from './AddTask';
import { PROJECT_LIST, PROJECTS } from '../config';

export default function Projects({ tasks, onStatusChange, onAdd }) {
  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
        {PROJECT_LIST.map(proj => {
          const p = PROJECTS[proj];
          const active = tasks.filter(t => t.project === proj && t.status !== 'Done');
          const done = tasks.filter(t => t.project === proj && t.status === 'Done');

          return (
            <div key={proj} style={{
              background: 'var(--bg-2)',
              border: `1px solid ${p.border}`,
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '0.875rem 1rem',
                borderBottom: `1px solid ${p.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: p.bg,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: p.color }}>
                    {proj}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: p.color, opacity: 0.7 }}>
                  {active.length} active
                </span>
              </div>

              <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {active.length === 0 && (
                  <div style={{ color: 'var(--text-3)', fontSize: 12, padding: '0.5rem 0' }}>
                    No active tasks
                  </div>
                )}
                {active.map(t => (
                  <TaskCard key={t.id} task={t} onStatusChange={onStatusChange} />
                ))}

                {done.length > 0 && (
                  <details style={{ marginTop: 4 }}>
                    <summary style={{ fontSize: 11, color: 'var(--text-3)', cursor: 'pointer', listStyle: 'none', padding: '4px 0' }}>
                      {done.length} completed ›
                    </summary>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 5 }}>
                      {done.map(t => (
                        <TaskCard key={t.id} task={t} onStatusChange={onStatusChange} />
                      ))}
                    </div>
                  </details>
                )}

                <div style={{ marginTop: 6 }}>
                  <AddTask defaultProject={proj} onAdd={onAdd} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
