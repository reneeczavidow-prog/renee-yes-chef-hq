const SCREENS = ['today', 'projects', 'pipeline', 'meetings'];

const LABELS = {
  today: 'Today',
  projects: 'Projects',
  pipeline: 'Pipeline',
  meetings: 'Meetings',
};

export default function Topbar({ screen, onNav, loading }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.875rem 1.5rem',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 15,
          color: 'var(--text)', letterSpacing: '0.04em',
        }}>
          YES CHEF HQ
        </span>
        <span style={{
          fontSize: 11, color: 'var(--text-3)',
          background: 'var(--bg-3)', padding: '3px 10px',
          borderRadius: 20, border: '1px solid var(--border)',
        }}>
          {dateStr}
        </span>
        {loading && (
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>syncing...</span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {SCREENS.map(s => (
          <button
            key={s}
            onClick={() => onNav(s)}
            style={{
              padding: '5px 14px', borderRadius: 20,
              background: screen === s ? 'var(--text)' : 'transparent',
              color: screen === s ? 'var(--bg)' : 'var(--text-3)',
              border: screen === s ? 'none' : '1px solid var(--border)',
              fontSize: 12, fontWeight: screen === s ? 500 : 400,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (screen !== s) { e.target.style.color = 'var(--text)'; e.target.style.borderColor = 'var(--border-hover)'; } }}
            onMouseLeave={e => { if (screen !== s) { e.target.style.color = 'var(--text-3)'; e.target.style.borderColor = 'var(--border)'; } }}
          >
            {LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
