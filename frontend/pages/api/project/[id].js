import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { id } = req.query;

  try {
    const filePath = path.join(process.cwd(), 'data', 'projects.json');
    const fileStream = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileStream);

    if (!data[id]) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(data[id]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read file or parse JSON' });
  }
}
