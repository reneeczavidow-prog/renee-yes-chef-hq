import express from 'express';
import cors from 'cors';
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const TASKS_DB = process.env.NOTION_TASKS_DB;
const MEETINGS_DB = process.env.NOTION_MEETINGS_DB;

function taskFromNotion(page) {
  const p = page.properties;
  return {
    id: page.id,
    name: p.Name?.title?.[0]?.plain_text || '',
    project: p.Project?.select?.name || '',
    status: p.Status?.select?.name || 'This Week',
    priority: p.Priority?.select?.name || 'Medium',
    owner: p.Owner?.select?.name || 'Me',
    fromMeeting: p['From Meeting']?.rich_text?.[0]?.plain_text || '',
    notes: p.Notes?.rich_text?.[0]?.plain_text || '',
    dueDate: p['Due Date']?.date?.start || '',
    url: page.url,
  };
}

function meetingFromNotion(page) {
  const p = page.properties;
  return {
    id: page.id,
    name: p.Name?.title?.[0]?.plain_text || '',
    date: p.Date?.date?.start || '',
    project: p.Project?.select?.name || '',
    attendees: p.Attendees?.rich_text?.[0]?.plain_text || '',
    summary: p.Summary?.rich_text?.[0]?.plain_text || '',
    actionItems: p['Action Items']?.rich_text?.[0]?.plain_text || '',
    triaged: p.Triaged?.checkbox || false,
    notionUrl: p['Notion URL']?.url || '',
    url: page.url,
  };
}

app.get('/api/tasks', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: TASKS_DB,
      sorts: [{ property: 'Status', direction: 'ascending' }],
    });
    res.json(response.results.map(taskFromNotion));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { name, project, status, priority, owner, fromMeeting, notes, dueDate } = req.body;
    const page = await notion.pages.create({
      parent: { database_id: TASKS_DB },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Project: { select: { name: project } },
        Status: { select: { name: status || 'This Week' } },
        Priority: { select: { name: priority || 'Medium' } },
        Owner: { select: { name: owner || 'Me' } },
        ...(fromMeeting && { 'From Meeting': { rich_text: [{ text: { content: fromMeeting } }] } }),
        ...(notes && { Notes: { rich_text: [{ text: { content: notes } }] } }),
        ...(dueDate && { 'Due Date': { date: { start: dueDate } } }),
      },
    });
    res.json(taskFromNotion(page));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { status, owner, priority } = req.body;
    const props = {};
    if (status) props.Status = { select: { name: status } };
    if (owner) props.Owner = { select: { name: owner } };
    if (priority) props.Priority = { select: { name: priority } };
    const page = await notion.pages.update({ page_id: req.params.id, properties: props });
    res.json(taskFromNotion(page));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/meetings', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: MEETINGS_DB,
      sorts: [{ property: 'Date', direction: 'descending' }],
    });
    res.json(response.results.map(meetingFromNotion));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch('/api/meetings/:id/triage', async (req, res) => {
  try {
    await notion.pages.update({
      page_id: req.params.id,
      properties: { Triaged: { checkbox: true } },
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
