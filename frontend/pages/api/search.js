import { projects as ProjectList } from "@/data/projects";
import levenshtein from "@/components/levenshtein";

export default async function handler(req, res) {
  try {
    const { q = "", sortby = "" } = req.query;
    if (req.headers.authorization !== "Bearer BananaIsAmazing") {
      res.status(401).json(["Unauthorized"]);
    }
    if (!q) return res.status(400).json({ error: "Empty query" });

    const scores = {};
    let maxS = 0;
    let minS = 0;

    const delay = (ms) => new Promise((r) => setTimeout(r, ms));

    const getScore = (project, inputQuery) => {
      if (!project || !inputQuery) return 0;

      if (
        inputQuery == project.name ||
        inputQuery == project.id ||
        inputQuery == project.slack_id ||
        inputQuery == project.author
      )
        return 750;

      const q = inputQuery
        .toLowerCase()
        .replace(/[_-]/g, " ")
        .split(" ")
        .filter(Boolean);
      const lowPriority = `${project.description || ""} ${
        project.slack_id || ""
      } ${project.demo_url || ""}`
        .toLowerCase()
        .replace(/[_-]/g, " ")
        .split(" ");
      const highPriority = `${project.name || ""} ${project.title || ""} ${
        project.author || ""
      } ${project.author_name || ""} ${project.author_real_name || ""} ${
        project.id || ""
      }`
        .toLowerCase()
        .replace(/[_-]/g, " ")
        .split(" ");

      let score = 0;

      q.forEach((word) => {
        highPriority.forEach((target) => {
          if (word === target) score += 25;
          else if (target.includes(word)) score += 20;
          else if (levenshtein(word, target) < 3) score += 10;
        });
        lowPriority.forEach((target) => {
          if (word.length > 2) {
            if (word === target) score += 12.5;
            else if (target.includes(word)) score += 10;
          }
        });
      });

      if (sortby && typeof project[sortby] === "number") {
        score += project[sortby] * 10;
      }

      maxS = Math.max(maxS, score);
      minS = Math.min(minS, score);

      return score;
    };

    const search = async (q) => {
      const keys = Object.keys(ProjectList);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const score = getScore(ProjectList[key], q);
        if (score >= 5) scores[key] = score;
        if (i % 100 === 0) await delay(10);
      }

      const avg = minS + (maxS - minS) / 2;
      let sorted = Object.entries(scores)
        .filter(([_, score]) => score > avg)
        .sort((a, b) => b[1] - a[1])
        .map(([key]) => ProjectList[key])
        .map((proj) => ({
          ...proj,
          score: Math.floor(scores[proj.id]),
        }));
      return sorted.slice(0, 48);
    };

    const results = await search(q);
    if (!results || results.length === 0)
      return res.status(404).json({ error: "No results found" });

    res
      .status(200)
      .json({
        results: results,
        "SOMPS by Muhammad Ali": "Powered by Alimad Surviellance",
      });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
}
