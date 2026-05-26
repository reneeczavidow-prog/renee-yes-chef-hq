import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

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
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  try {
    if (req.method === 'PATCH') {
      const { status, owner, priority } = req.body;
      const props = {};
      if (status) props.Status = { select: { name: status } };
      if (owner) props.Owner = { select: { name: owner } };
      if (priority) props.Priority = { select: { name: priority } };
      const page = await notion.pages.update({ page_id: id, properties: props });
      return res.json(taskFromNotion(page));
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
