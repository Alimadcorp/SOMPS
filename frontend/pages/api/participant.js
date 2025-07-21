import { projects as data } from "@/data/projects.js";

function parseHours(i) {
  let a = i.split(" ");
  let h = a[0].replace("h", "").trim();
  let m = a[1].replace("m", "").trim();
  return parseInt(h) + parseInt(m) / 60;
}

export default function handler(req, res) {
  let { id, project } = req.query;
  if (project && !id) {
    id = data[project].slack_id;
  }
  if (typeof id != "string") {
    return res.status(400).json(["Bad request, nerd"]);
  }
  try {
    let response = {
      id: id,
      github: "",
      pronouns: "",
      most_recent_activity: 0,
      name: "",
      real_name: "",
      som_name: "",
      tz: "",
      tz_offset: 999999999999,
      slack_join_date: "",
      pfp: "",
      deleted: false,
      total_devlogs: 0,
      total_hours: 0,
      projects: [],
    };
    let found = false;
    const k = Object.keys(data);
    for (let i = 0; i < k.length; i++) {
      if (data[k[i]].slack_id == id) {
        const p = data[k[i]];
        response.projects.push(p);
        let g = p.repo_link;
        if (g)
          response.github = g.replace(
            /^https?:\/\/github\.com\/([^/]+)\/.*$/,
            "github.com/$1"
          );
        if (new Date(response.most_recent_activity) < new Date(p.updated_at))
          response.most_recent_activity = p.updated_at;
        if (p.author_name) response.name = p.author_name;
        if (p.author) response.som_name = p.author;
        if (p.author_real_name) response.real_name = p.author_real_name;
        if (p.author_timezone) response.tz = p.author_timezone;
        if (p.timezone_offset) response.tz_offset = p.timezone_offset;
        if (p.author_slack_start_date)
          response.slack_join_date = p.author_slack_start_date;
        if (p.author_pfp) response.pfp = p.author_pfp.replace(/192\.jpg$/, "1024.jpg");
        if (p.author_pronouns) response.pronouns = p.author_pronouns;
        if (p.is_author_deleted) response.deleted = true;
        if (p.devlogs) response.total_devlogs += parseInt(p.devlogs);
        if (p.time) response.total_hours += parseHours(p.time);
        found = true;
      }
    }
    response.total_hours = response.total_hours.toFixed(2);
    console.log(response);
    if (found) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ Not: "found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to read file or parse JSON " + err.toString() });
  }
}
