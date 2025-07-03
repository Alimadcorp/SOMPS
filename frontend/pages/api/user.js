//import { users as data } from "@/data/users";
export default async function handler(req, res) {
  try {
    return res.status(500).json({ error: "Not implemented "});
    let { id } = req.query;
    if (!data) {
      return res.status(404).json({ error: "Users not found" });
    }
    if (!id) return res.status(400).json({ error: "Please provide user id" });
    
    if (!data[id]) return res.status(404).json({ error: "User not found" });
    res.status(200).json(data[id]);
  } catch (err) {
    res.status(500).json({ error: "Failed to read file or parse JSON" });
  }
}
