import { participants as data } from "@/data/allThem";
export default function handler(req, res) {
  try {
    if (!data) {
      return res.status(404).send("bruh");
    }
    res.status(200).send(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read file or parse JSON' });
    console.log(err)
  }
}