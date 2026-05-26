import { useState, useEffect, useCallback } from 'react';
import './index.css';
import { getTasks, createTask, updateTask, getMeetings, markMeetingTriaged } from './api';
import Triage from './components/Triage';
import Today from './components/Today';
import Projects from './components/Projects';
import Pipeline from './components/Pipeline';
import Meetings from './components/Meetings';
import Topbar from './components/Topbar';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [screen, setScreen] = useState('triage');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [t, m] = await Promise.all([getTasks(), getMeetings()]);
      setTasks(t);
      setMeetings(m);
      const hasUntriaged = m.some(mt => !mt.triaged && mt.actionItems);
      setScreen(hasUntriaged ? 'triage' : 'today');
    } catch (e) {
      setError('Could not connect to Notion. Make sure your server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreateTask = async (data) => {
    try {
      const task = await createTask(data);
      setTasks(prev => [task, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (id, status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    try {
      await updateTask(id, { status });
    } catch (e) {
      console.error(e);
    }
  };

  const handleFlipToMe = async (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, owner: 'Me', status: 'This Week' } : t));
    try {
      await updateTask(id, { owner: 'Me', status: 'This Week' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkTriaged = async (id) => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, triaged: true } : m));
    try {
      await markMeetingTriaged(id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriageComplete = () => setScreen('today');

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>
          YES CHEF HQ
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Loading your day...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', flexDirection: 'column', gap: 12, padding: '2rem', textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: 'var(--ff)' }}>
          Connection Error
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 400 }}>{error}</div>
        <button onClick={load} style={{
          padding: '0.75rem 1.5rem', borderRadius: 'var(--radius)',
          background: 'var(--text)', color: 'var(--bg)', fontSize: 13, fontWeight: 500,
          marginTop: 8,
        }}>
          Retry
        </button>
      </div>
    );
  }

  if (screen === 'triage') {
    return (
      <Triage
        meetings={meetings}
        tasks={tasks}
        onComplete={handleTriageComplete}
        onCreateTask={handleCreateTask}
        onMarkTriaged={handleMarkTriaged}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Topbar screen={screen} onNav={setScreen} loading={loading} />
      {screen === 'today' && (
        <Today tasks={tasks} onStatusChange={handleStatusChange} onFlipToMe={handleFlipToMe} onAdd={handleCreateTask} />
      )}
      {screen === 'projects' && (
        <Projects tasks={tasks} onStatusChange={handleStatusChange} onAdd={handleCreateTask} />
      )}
      {screen === 'pipeline' && (
        <Pipeline tasks={tasks} onStatusChange={handleStatusChange} />
      )}
      {screen === 'meetings' && (
        <Meetings meetings={meetings} tasks={tasks} />
      )}
    </div>
  );
}
