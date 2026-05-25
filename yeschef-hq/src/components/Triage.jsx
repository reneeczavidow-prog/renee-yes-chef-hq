import { useState } from 'react';
import { OWNERS, PROJECTS } from '../config';

export default function Triage({ meetings, tasks, onComplete, onCreateTask, onMarkTriaged }) {
  const untriaged = meetings.filter(m => !m.triaged && m.actionItems);
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState('choose');
  const [owner, setOwner] = useState('');

  if (untriaged.length === 0 || idx >= untriaged.length) {
    return null;
  }

  const meeting = untriaged[idx];
  const actionLines = meeting.actionItems.split('\n').filter(Boolean);
  const proj = PROJECTS[meeting.project] || PROJECTS['General Ops'];

  const advance = () => {
    onMarkTriaged(meeting.id);
    if (idx + 1 >= untriaged.length) {
      onComplete();
    } else {
      setIdx(i => i + 1);
      setStep('choose');
      setOwner('');
    }
  };

  const handleMine = () => {
    actionLines.forEach(line => {
      onCreateTask({
        name: line.replace(/^[-*]\s*/, ''),
        project: meeting.project || 'General Ops',
        status: 'This Week',
        priority: 'Medium',
        owner: 'Me',
        fromMeeting: meeting.name,
      });
    });
    advance();
  };

  const handleOther = () => setStep('pick-owner');

  const handleConfirmOwner = () => {
    if (!owner) return;
    actionLines.forEach(line => {
      onCreateTask({
        name: line.replace(/^[-*]\s*/, ''),
        project: meeting.project || 'General Ops',
        status: 'This Week',
        priority: 'Medium',
        owner,
        fromMeeting: meeting.name,
      });
    });
    advance();
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: '2rem',
    }}>
      <div style={{
        width: '100%', maxWidth: 480,
        background: 'var(--bg-2)',
        border: `1px solid ${proj.border}`,
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        animation: 'fadeIn 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <span style={{
            fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: proj.color, background: proj.bg,
            padding: '4px 10px', borderRadius: 20,
          }}>
            New from meeting
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
            {idx + 1} of {untriaged.length}
          </span>
        </div>

        <div style={{ marginBottom: '0.5rem', fontSize: 11, color: 'var(--text-2)' }}>
          {meeting.date} · {meeting.project}
        </div>
        <div style={{ fontSize: 18, fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.3 }}>
          {meeting.name}
        </div>

        <div style={{
          background: 'var(--bg-3)', borderRadius: 'var(--radius)',
          padding: '0.875rem 1rem', marginBottom: '1.5rem',
        }}>
          <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            Action items
          </div>
          {actionLines.map((line, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '3px 0', color: 'var(--text-2)', fontSize: 12 }}>
              <span style={{ color: proj.color, marginTop: 2 }}>›</span>
              <span>{line.replace(/^[-*]\s*/, '')}</span>
            </div>
          ))}
        </div>

        {step === 'choose' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1rem' }}>
              <button onClick={handleMine} style={{
                padding: '0.875rem', borderRadius: 'var(--radius)',
                background: 'var(--rc-bg)', border: '1px solid var(--rc-border)',
                color: 'var(--rc)', fontSize: 13, fontWeight: 500,
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => e.target.style.background = '#00D08422'}
                onMouseLeave={e => e.target.style.background = 'var(--rc-bg)'}
              >
                Mine
              </button>
              <button onClick={handleOther} style={{
                padding: '0.875rem', borderRadius: 'var(--radius)',
                background: 'var(--tg-bg)', border: '1px solid var(--tg-border)',
                color: 'var(--tg)', fontSize: 13, fontWeight: 500,
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => e.target.style.background = '#0099FF22'}
                onMouseLeave={e => e.target.style.background = 'var(--tg-bg)'}
              >
                Someone else
              </button>
            </div>
            <div
              onClick={advance}
              style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-3)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Skip for now
            </div>
          </>
        )}

        {step === 'pick-owner' && (
          <>
            <select
              value={owner}
              onChange={e => setOwner(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)',
                background: 'var(--bg-3)', border: '1px solid var(--border)',
                color: 'var(--text)', marginBottom: '0.75rem',
              }}
            >
              <option value=''>Select owner...</option>
              {OWNERS.filter(o => o !== 'Me').map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <button
              onClick={handleConfirmOwner}
              disabled={!owner}
              style={{
                width: '100%', padding: '0.875rem', borderRadius: 'var(--radius)',
                background: owner ? 'var(--text)' : 'var(--bg-4)',
                color: owner ? 'var(--bg)' : 'var(--text-3)',
                fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 500,
                cursor: owner ? 'pointer' : 'not-allowed', transition: 'all 0.15s',
              }}
            >
              Confirm owner
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}
