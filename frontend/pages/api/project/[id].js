import { projects as data } from "../../../data/projects.js";
export default function handler(req, res) {
  const { id } = req.query;

  try {
    if (!data[id]) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(data[id]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read file or parse JSON' });
  }
}
