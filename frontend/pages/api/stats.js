import { stats as data } from "@/data/stats";
export default function handler(req, res) {
  try {
    if (!data) {
      return res.status(404).json({ error: 'Stats not found' });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read file or parse JSON' });
  }
}