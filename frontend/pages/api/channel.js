import { conversations as data } from "@/data/conversations";
export default async function handler(req, res) {
  try {
    let { id } = req.query;
    if (!data) {
      return res.status(404).json({ error: "Conversations not found" });
    }
    if (!id) return res.status(400).json({ error: "Please provide id" });

    let response = {};
    let all = id
      .split(",")
      .filter(Boolean)
    for (let i = 0; i < all.length; i++) {
      response[all[i]] = data[all[i]];
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: "Failed to read file or parse JSON" });
  }
}
