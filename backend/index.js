const fs = require("fs");
//console.log(btoa(fs.readFileSync("temp.txt", "utf-8")))
const axios = require("axios");
const parser = require("node-html-parser");
//return;
let projectss = [];
let projects = {};
let users = {};
let env = {};
let r = fs.readFileSync("environment.txt", "utf-8").split("\n");
r.forEach((e) => {
  env[e.split("===")[0]] = e.split("===")[1];
});
const SLACK_TOKEN = env.SLACK_TOKEN;
const cookie = env.COOKIE;
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
let cursorList = [];
async function fetchAllUsers() {
  let allUsers = {};
  let allUsersRaw = {};

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
        let usersRaw = {};
        for (let i = 0; i < res.data.members.length; i++) {
          let x = res.data.members[i];
          if (Math.random() < 0.00001) console.log(x);
          users[x.id] = {
            author_name: x.name,
            author_real_name: x.real_name,
            author_timezone: x.tz,
            timezone_offset: x.tz_offset,
            author_slack_start_date: x.profile.start_date,
            author_pronouns: x.profile.pronouns,
            author_pfp: x.profile.image_192,
            is_author_deleted: x.deleted,
          };
          usersRaw[x.id] = x;
        }
        const nextCursor = res.data.response_metadata?.next_cursor || "";
        return { users, nextCursor, usersRaw };
      } catch (e) {
        attempts++;
        if (attempts >= 3) {
          console.error("Failed after 3 retries:", e);
          return { users: {}, nextCursor: "", usersRaw: {} };
        }
      }
    }
    return { users: {}, nextCursor: "", usersRaw: {} };
  };

  let cursor = "";
  do {
    let { users, nextCursor, usersRaw } = await fetchPage(cursor);
    allUsers = { ...allUsers, ...users };
    allUsersRaw = { ...allUsersRaw, ...usersRaw };
    cursor = nextCursor;
    if (cursor) await delay(0);
    cursorList.push(cursor);
  } while (cursor);
  fs.writeFileSync("usersRaw.json", JSON.stringify(allUsersRaw), "utf-8");
  return allUsers;
}
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const hours = timeStr.match(/(\d+)h/)?.[1] || 0;
  const minutes = timeStr.match(/(\d+)m/)?.[1] || 0;
  return Number.parseInt(hours) * 60 + Number.parseInt(minutes);
};

async function fetchAllConversations() {
  let cursor = null;
  const allConversations = {};

  while (true) {
    const res = await axios.get("https://slack.com/api/conversations.list", {
      headers: {
        Authorization: `Bearer ${env.SLACK_TOKEN}`,
      },
      params: {
        limit: 1000,
        types: "public_channel",
        cursor,
      },
    });

    if (!res.data.ok) throw new Error(res.data.error);

    for (const c of res.data.channels) {
      allConversations[c.id] = {
        name: c.name,
        created: c.created,
        is_archived: c.is_archived,
        updated: c.updated || null,
        creator: c.creator,
        topic: c.topic?.value || "",
        purpose: encodeURIComponent(c.purpose?.value) || "",
        members: c.num_members || 0,
      };
    }

    cursor = res.data.response_metadata?.next_cursor;
    if (!cursor) break;
  }

  const out = `export const conversations = ${JSON.stringify(
    allConversations
  )};`;
  const channs = Object.keys(allConversations).length;
  fs.writeFileSync("channels.txt", channs.toString(), "utf-8");
  fs.writeFileSync("../frontend/data/conversations.js", out);
  console.log("conversations.js written!");
}

async function main() {
  if (/*You want to fetch all users again:*/ false) {
    //users = fs.readFileSync("users.json", "utf-8");
    //return;x
    await fetchAllConversations().catch(console.error);
    console.log("Channels fetched");
    users = await fetchAllUsers();
    users["U08PX9YEYNQ"].author_timezone = "Asia/Singapore";
    users["U08LQFRBL6S"].author_timezone = "Asia/Lahore";
    let lusers = JSON.parse(fs.readFileSync("users.json", "utf-8"));
    console.log(
      `${
        Object.keys(users).length - Object.keys(lusers).length
      } new users joined since last fetch`
    );
    fs.writeFileSync("users.json", JSON.stringify(users), "utf8");
    fs.writeFileSync("cursors.json", JSON.stringify(cursorList), "utf8");
    //fs.writeFileSync("../frontend/data/users.js", `export const users = ${JSON.stringify(users).replaceAll("\\\"", "\"").replace(/^\"/g, "").replace(/\"$/g, "")}`);
    return;
  }
  let r = await fetch("https://summer.hackclub.com/votes/locked", {
    headers: {
      Cookie: cookie,
    },
  });
  let b = await r.text();
  fs.writeFileSync("aaa.html", b, "utf-8");
  const par = parser.parse(b);
  let elem = par.querySelector(".card-with-gradient.text-lg.text-center");
  let es = elem.querySelectorAll("p");
  let c = es[1].innerHTML.replace(/ \/.+$/, "");
  let tt = es[2].innerHTML
    .replace(" certified projects, any amount of coding time)", "")
    .replace("(", "");
  r = await fetch("https://summer.hackclub.com/votes/new", {
    headers: {
      Cookie: cookie,
    },
  });
  b = await r.text();

  fs.writeFileSync("aaa2.html", b, "utf-8");
  const par2 = parser.parse(b);
  elem = par2.querySelector(".text-lg.opacity-60");
  let votes = parseInt(elem.innerHTML.match(/\! \d+/g)[0].replace("! ", ""));
  users = JSON.parse(fs.readFileSync("users.json", "utf-8"));
  let usersActive = Object.values(users).filter((e) => {
    return !e.is_author_deleted;
  });
  let usersJoined = {};
  let userHours = {};
  let bannedUsers = ["U091RNMRAH2"];
  let conversations = parseInt(fs.readFileSync("channels.txt", "utf-8"));
  let pl = Object.keys(projects).length;
  let banners = JSON.parse(fs.readFileSync("banners.json", "utf-8"));
  const k = Object.keys(projects);
  let minss = 0;
  let devlogs = 0;
  let unf = [],
    bnf = [];
  for (let i = 0; i < k.length; i++) {
    let j = k[i];
    let x = projects[j];
    let u = users[x.slack_id];
    if (!bannedUsers.includes(x.slack_id)) {
      usersJoined[x.slack_id] = (usersJoined[x.slack_id] || 0) + 1;
    }
    if (!u) {
      unf.push(x.slack_id);
    }
    let b = banners[j];
    if (!b) {
      bnf.push(j);
    }
    devlogs += parseInt(b?.devlogs || "0");
    x = {
      ...x,
      ...u,
      ...b,
    };
    projects[j] = x;
    if (!bannedUsers.includes(x.slack_id)) {
      userHours[x.slack_id] =
        (userHours[x.slack_id] || 0) + parseTimeToMinutes(x.time);
      //console.log(x.id, x.time, parseTimeToMinutes(x.time), minss/60);
      minss += parseTimeToMinutes(x.time);
      //await delay(50);
    }
  }
  console.log(
    `There are total ${
      Object.keys(projects).length
    } projects, out of which you have ${
      Object.keys(banners).length
    } banners for.`
  );
  console.log(
    `A total of ${
      Math.floor((minss / 60) * 100) / 100
    } hours have been spent on cool projects`
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
  console.log(`${c} certified with 10h+ and ${tt} total certified`);
  let joined = Object.keys(usersJoined);
  joined = joined
    .sort((a, b) => {
      return usersJoined[b] - usersJoined[a];
    })
    .splice(0, 10);
  let h = Object.keys(userHours);
  h = h.sort((a, b) => {
    return userHours[b] - userHours[a];
  });
  let ress = h;
  let output = "Position,ID,Name,Hours";
  for (let i = 0; i < ress.length; i++) {
    const slackId = ress[i];
    const user = users[slackId];
    output += `\n${(i + 1).toString().padStart(4, "0")},${slackId},${
      user?.author_real_name
    },${Math.floor((userHours[slackId] / 60) * 10) / 10}`;
  }
  fs.writeFileSync("allSummerParticipants.csv", output, "utf-8");
  fs.writeFileSync(
    "../frontend/data/allThem.js",
    `export const participants = \`${output}\``,
    "utf-8"
  );
  let g = h.splice(11, 100);
  h = h.splice(0, 10);
  console.log("Top 10 users with projects:");
  let top10 = [];
  let top10Hours = [];
  let next10_users = [];
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
  for (let i = 0; i < h.length; i++) {
    const slackId = h[i];
    const user = users[slackId];
    console.log(
      `\t${user?.author_name || slackId}: ${userHours[slackId]} minutes`
    );
    top10Hours.push({
      name: user?.author_real_name || slackId,
      pfp: user?.author_pfp,
      url: `/search?q=${slackId}`,
      hours: userHours[slackId],
    });
  }
  for (let i = 0; i < g.length; i++) {
    const slackId = g[i];
    const user = users[slackId];
    next10_users.push({
      name: user?.author_real_name || slackId,
      pfp: user?.author_pfp,
      url: `/search?q=${slackId}`,
      hours: userHours[slackId],
    });
  }
  console.log(top10Hours);
  console.log(`${Object.keys(projects).length - pl} new projects found`);
  console.log(`Could not find ${unf.length} users and ${bnf.length} banners:`);
  console.log(unf.join(", "));
  console.log(bnf.join(", "));
  const lastStats = fs.readFileSync("../frontend/data/stats.js", "utf8");
  let parseddd = JSON.parse(lastStats.split("export const stats = ")[1]);
  let project_chart = parseddd.project_chart || {};
  let user_chart = parseddd.user_chart || {};
  let participants_chart = parseddd.participants_chart || {};
  let minutes_chart = parseddd.minutes_chart || {};
  let votes_chart = parseddd.votes_chart || {};
  let t = new Date();
  t = t.toISOString();
  user_chart[t] = usersActive.length;
  project_chart[t] = Object.keys(projects).length;
  participants_chart[t] = Object.keys(usersJoined).length;
  votes_chart[t] = votes;
  minutes_chart[t] = minss;
  let stats = {
    total_projects: Object.keys(projects).length,
    certified: tt,
    certified_10: c,
    devlogs,
    channels: Object.keys(conversations).length,
    votes_cast: votes,
    project_chart: project_chart,
    user_chart,
    participants_chart,
    votes_chart,
    minutes_chart,
    total_users: usersActive.length,
    total_minutes: minss,
    joined_users: Object.keys(usersJoined).length,
    top10_users: top10,
    top10Hours,
    next90_users: next10_users,
    last_sync: new Date().toISOString(),
  };
  fs.writeFileSync("projectsfinal.json", JSON.stringify(projects), "utf8");
  fs.writeFileSync(
    "../frontend/data/projects.js",
    `export const projects = ${JSON.stringify(projects)};`,
    "utf8"
  );
  fs.writeFileSync(
    `./statcache/${new Date()
      .toISOString()
      .replaceAll(":", "-")
      .replace(/\.\d{3}/, "")}.json`,
    `${JSON.stringify(stats, null, 2)}`,
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
