const fs = require("fs");
const axios = require("axios");
let projectss = [];
let projects = {};
let users = {};
let env = {};
let r = fs.readFileSync("environment.txt", "utf-8").split("\n");
r.forEach((e) => {
  env[e.split("===")[0]] = e.split("===")[1];
});
const SLACK_TOKEN = env.SLACK_TOKEN;
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
try {
  const data = fs.readFileSync("projects.json", "utf8");
  projectss = JSON.parse(data);
  for (let i = 0; i < projectss.length; i++) {
    projects[projectss[i].id] = { ...projectss[i] };
  }
} catch (err) {
  console.error(err);
}

async function fetchAllUsers() {
  let allUsers = {};

  const fetchPage = async (cursor) => {
    let attempts = 0;
    while (attempts < 3) {
      try {
        const url = new URL("https://slack.com/api/users.list");
        url.searchParams.set("limit", 1000);
        if (cursor) url.searchParams.set("cursor", cursor);
        console.log("Fetching...");

        const res = await axios.get(url.toString(), {
          headers: { Authorization: `Bearer ${SLACK_TOKEN}` },
          validateStatus: () => true,
        });
        if (res.status !== 200 || !res.data.ok)
          throw new Error("Slack API failed");

        console.log(`Fetched 1000 ${cursor ? "more " : ""}users`);
        let users = {};
        for (let i = 0; i < res.data.members.length; i++) {
          let x = res.data.members[i];
          users[x.id] = {
            author_name: x.name,
            author_real_name: x.real_name,
            author_timezone: x.tz,
            author_slack_start_date: x.profile.start_date,
            author_pronouns: x.profile.pronouns,
            author_pfp: x.profile.image_512,
            is_author_deleted: x.deleted,
          };
        }
        const nextCursor = res.data.response_metadata?.next_cursor || "";
        return { users, nextCursor };
      } catch (e) {
        attempts++;
        if (attempts >= 3) {
          console.error("Failed after 3 retries:", e);
          return { users: {}, nextCursor: "" };
        }
      }
    }
    return { users: {}, nextCursor: "" };
  };

  let cursor = "";
  do {
    let { users, nextCursor } = await fetchPage(cursor);
    allUsers = { ...allUsers, ...users };
    cursor = nextCursor;
    if (cursor) await delay(0);
  } while (cursor);

  return allUsers;
}

async function main() {
  if (/*You want to fetch all users again:*/ false) {
    users = await fetchAllUsers();
    users["U08PX9YEYNQ"].author_timezone = "Asia/Singapore";
    let lusers = JSON.parse(fs.readFileSync("users.json", "utf-8"));
    console.log(
      `${
        Object.keys(users).length - Object.keys(lusers).length
      } new users joined since last fetch`
    );
    fs.writeFileSync("users.json", JSON.stringify(users), "utf8");
    return;
  }
  users = JSON.parse(fs.readFileSync("users.json", "utf-8"));
  let usersActive = Object.values(users).filter((e) => {
    return !e.is_author_deleted;
  });
  let usersJoined = {};
  let pl = Object.keys(projects).length;
  let banners = JSON.parse(fs.readFileSync("banners.json", "utf-8"));
  const k = Object.keys(projects);
  let unf = [],
    bnf = [];
  for (let i = 0; i < k.length; i++) {
    let j = k[i];
    let x = projects[j];
    let u = users[x.slack_id];
    usersJoined[x.slack_id] = (usersJoined[x.slack_id] || 0) + 1;
    if (!u) {
      unf.push(x.slack_id);
    }
    let b = banners[j];
    if (!b) {
      bnf.push(j);
    }
    x = {
      ...x,
      ...u,
      ...b,
    };
    projects[j] = x;
  }
  console.log(
    `There are total ${
      Object.keys(projects).length
    } projects, out of which you have ${
      Object.keys(banners).length
    } banners for.`
  );
  console.log(
    `There are ${
      Object.keys(users).length
    } users in the hackclub, out of which ${
      usersActive.length
    } activated accounts, out of which ${
      Object.keys(usersJoined).length
    } created projects`
  );
  let joined = Object.keys(usersJoined);
  joined = joined
    .sort((a, b) => {
      return usersJoined[b] - usersJoined[a];
    })
    .splice(0, 10);
  console.log("Top 10 users with projects:");
  let top10 = [];
  const team_id = "T0266FRGM";
  for (let i = 0; i < joined.length; i++) {
    const slackId = joined[i];
    const user = users[slackId];
    console.log(
      `\t${user?.author_name || slackId}: ${usersJoined[slackId]} projects`
    );
    top10.push({
      name: user?.author_real_name || slackId,
      pfp: user?.author_pfp,
      url: `/search?q=${slackId}`,
      projects: usersJoined[slackId],
    });
  }
  console.log(`${Object.keys(projects).length - pl} new projects found`);
  console.log(`Could not find ${unf.length} users and ${bnf.length} banners:`);
  console.log(unf.join(", "));
  console.log(bnf.join(", "));
  const lastStats = fs.readFileSync(
    "../frontend/data/stats.js",
    "utf8"
  );
  let project_chart = JSON.parse(lastStats.split("export const stats = ")[1]).project_chart || {};
  let t = new Date();
  t = t.toISOString();
  project_chart[t] = Object.keys(projects).length;
  let stats = {
    total_projects: Object.keys(projects).length,
    project_chart: project_chart,
    total_users: usersActive.length,
    joined_users: Object.keys(usersJoined).length,
    top10_users: top10,
  };
  fs.writeFileSync("projectsfinal.json", JSON.stringify(projects), "utf8");
  fs.writeFileSync(
    "../frontend/data/projects.js",
    `export const projects = ${JSON.stringify(projects)};`,
    "utf8"
  );
  fs.writeFileSync(
    "../frontend/data/stats.js",
    `export const stats = ${JSON.stringify(stats, null, 2)}`,
    "utf8"
  );
}

async function mainStarter() {
  await main();
}

mainStarter();
