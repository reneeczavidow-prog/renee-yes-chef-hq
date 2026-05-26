import { PROJECTS } from '../config';

export default function Meetings({ meetings, tasks }) {
  const sorted = [...meetings].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return (
    <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
        Meeting notes database
      </div>
      {sorted.length === 0 && (
        <div style={{ color: 'var(--text-3)', fontSize: 13, padding: '2rem 0' }}>
          No meeting notes yet. They'll appear here automatically when Notion AI captures them.
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.map(m => {
          const proj = PROJECTS[m.project] || PROJECTS['General Ops'];
          const relatedTasks = tasks.filter(t => t.fromMeeting === m.name);

          return (
            <div key={m.id} style={{
              background: 'var(--bg-2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = proj.border}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)', flex: 1, paddingRight: 12 }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', flexShrink: 0 }}>{m.date}</div>
                </div>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 20,
                  background: proj.bg, color: proj.color, display: 'inline-block', marginBottom: 10,
                }}>
                  {m.project}
                </span>

                {m.summary && (
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 10, lineHeight: 1.6 }}>
                    {m.summary}
                  </div>
                )}

                {m.actionItems && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                      Action items
                    </div>
                    {m.actionItems.split('\n').filter(Boolean).map((line, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '2px 0', fontSize: 12, color: 'var(--text-2)' }}>
                        <span style={{ color: proj.color, marginTop: 2 }}>›</span>
                        <span>{line.replace(/^[-*]\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                )}

                {relatedTasks.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 10 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                      Tasks created
                    </div>
                    {relatedTasks.map(t => (
                      <div key={t.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '2px 0', fontSize: 12 }}>
                        <div style={{
                          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                          background: t.owner === 'Me' ? 'var(--rc)' : 'var(--tg)',
                        }} />
                        <span style={{ color: t.status === 'Done' ? 'var(--text-3)' : 'var(--text-2)', textDecoration: t.status === 'Done' ? 'line-through' : 'none' }}>
                          {t.name}
                        </span>
                        {t.owner !== 'Me' && <span style={{ color: 'var(--tg)', fontSize: 10 }}>→ {t.owner}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
