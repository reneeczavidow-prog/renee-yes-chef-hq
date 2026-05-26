import TaskCard from './TaskCard';
import AddTask from './AddTask';
import { PROJECTS } from '../config';

export default function Today({ tasks, onStatusChange, onFlipToMe, onAdd }) {
  const todayTasks = tasks.filter(t => t.status === 'Today' && t.owner === 'Me');
  const waiting = tasks.filter(t => t.owner !== 'Me' && t.status !== 'Done');
  const overdue = tasks.filter(t => t.owner === 'Me' && t.status !== 'Done' && t.dueDate && t.dueDate < new Date().toISOString().split('T')[0]);
  const doneCount = tasks.filter(t => t.status === 'Done').length;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: '2rem' }}>
        {[
          { label: "today's tasks", val: todayTasks.length, color: 'var(--rc)' },
          { label: 'waiting on others', val: waiting.length, color: 'var(--tg)' },
          { label: 'overdue', val: overdue.length, color: overdue.length > 0 ? 'var(--high)' : 'var(--text-2)' },
          { label: 'done total', val: doneCount, color: 'var(--text-2)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-2)', borderRadius: 'var(--radius)',
            padding: '1rem', border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 28, fontFamily: 'Syne, sans-serif', fontWeight: 800, color: s.color }}>
              {s.val}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
        Today's tasks
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '0.75rem' }}>
        {todayTasks.length === 0 && (
          <div style={{ color: 'var(--text-3)', fontSize: 12, padding: '1rem 0' }}>
            No tasks marked for today. Add one below or flag tasks from the pipeline.
          </div>
        )}
        {todayTasks.map(t => (
          <TaskCard key={t.id} task={t} onStatusChange={onStatusChange} />
        ))}
      </div>
      <AddTask onAdd={onAdd} />

      {waiting.length > 0 && (
        <>
          <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '2rem 0 0.75rem' }}>
            Waiting on others
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {waiting.map(t => (
              <TaskCard key={t.id} task={t} onStatusChange={onStatusChange} onFlipToMe={onFlipToMe} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
