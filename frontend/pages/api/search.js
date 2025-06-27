import { projects as ProjectList } from "@/data/projects";
import levenshtein from "@/components/levenshtein";

export default async function handler(req, res) {
  try {
    let { q = "", sort = "" } = req.query;
    if (
      req.headers.authorization !== "Bearer BananaIsAmazing" &&
      req.query.authorization !== "BananaIsAmazing"
    ) {
      res.status(401).json(["Unauthorized"]);
    }
    if (!q) return res.status(400).json({ error: "Empty query" });
    let maxS = 0;
    let minS = 0;
    function parseTimeToMinutes(timeStr) {
      if (!timeStr) return 0;
      const hours = timeStr.match(/(\d*)h/)?.[1] || 0;
      if (isNaN(hours)) return 0;
      const minutes = timeStr.match(/(\d*)m/)?.[1] || 0;
      if (isNaN(minutes)) return 0;
      return Number.parseInt(hours) * 60 + Number.parseInt(minutes);
    }
    const getSortScore = (project, sortType) => {
      switch (sortType) {
        case "devlogs":
          return (parseInt(project.devlogs) || 0) * 50;
        case "created_at_desc":
          return project.created_at
            ? new Date(project.created_at).getTime() / 1000000
            : 0;
        case "created_at_asc":
          const referenceDate = new Date(2025, 5, 10);
          let e = 0;
          if (project.created_at) {
            const createdTime = new Date(project.created_at).getTime();
            const diff = Math.abs(referenceDate.getTime() - createdTime);
            e = 1209600000 - diff;
          }
          return e;
        case "distance":
          let t = 0;
          if (project.timezone_offset != null) {
            const diff = Math.abs(project.timezone_offset - slackTzOffset);
            t = (50400 - diff) * 10;
          }
          return t;
        case "updated_at":
          return project.updated_at
            ? new Date(project.updated_at).getTime() / 1000000
            : 0;
        case "time":
          return parseTimeToMinutes(project.time) * 20;
        default:
          return 0;
      }
    };
    function getScore(project, inputQuery, sort = "") {
      if (!project || !inputQuery) return 0;
      let score = 0;
      if (sort) {
        score += getSortScore(project, sort);
      } else {
        if (
          inputQuery == project.name ||
          inputQuery == project.id ||
          inputQuery == project.slack_id ||
          inputQuery == project.author
        ) {
          return 750;
        }
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
        q.forEach((word) => {
          highPriority.forEach((target) => {
            if (word === target) score += 25;
            else if (target.includes(word) && word.length > 3) score += 20;
            else if (levenshtein(word, target) < 3) score += 10;
          });
          lowPriority.forEach((target) => {
            if (word.length > 2) {
              if (word === target) score += 12.5;
              else if (target.includes(word) && word.length > 3) score += 10;
            }
          });
        });
      }
      maxS = Math.max(maxS, score);
      minS = Math.min(minS, score);
      return score;
    }
    async function search(q, sort = "") {
      const scores = {};
      const amount = 100;
      const keys = Object.keys(ProjectList);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const score = getScore(ProjectList[key], q, sort);
        if (score >= 5) scores[key] = score;
      }
      let avg = minS + (maxS - minS) / 2;
      let sorted = Object.entries(scores)
        .filter(([_, score]) => {
          if (sort) {
            return true;
          } else {
            return score > avg;
          }
        })
        .sort((a, b) => b[1] - a[1]);
      sorted = sorted.slice(0, amount).map(([key]) => ProjectList[key]);
      return sorted;
    }
    const results = await search(q, sort);
    if (!results || results.length === 0)
      return res.status(404).json({ error: "No results found" });

    res.status(200).json({
      results: results,
      "SOMPS by Muhammad Ali": "Powered by Alimad Surviellance",
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
}
