import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const TASKS_DB = process.env.NOTION_TASKS_DB;

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const response = await notion.databases.query({
        database_id: TASKS_DB,
        sorts: [{ property: 'Status', direction: 'ascending' }],
      });
      return res.json(response.results.map(taskFromNotion));
    }

    if (req.method === 'POST') {
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
      return res.json(taskFromNotion(page));
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
