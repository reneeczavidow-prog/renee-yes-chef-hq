import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const MEETINGS_DB = process.env.NOTION_MEETINGS_DB;

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const response = await notion.databases.query({
        database_id: MEETINGS_DB,
        sorts: [{ property: 'Date', direction: 'descending' }],
      });
      return res.json(response.results.map(meetingFromNotion));
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
