const fs = require("fs");
const axios = require("axios");
let projects = [];
let users = {};
const SLACK_TOKEN = "xoxb-2210535565-8750527517188-Ab7tYR6S5kAG1NrVsIMyUwOp";
const EXPECTED_TOTAL_USERS = 58876 + 19747;
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
try {
  const data = fs.readFileSync("projects.json", "utf8");
  projects = JSON.parse(data);
} catch (err) {
  console.error(err);
}

async function fetchAllUsers() {
    const allUsers = [];
  
    const fetchPage = async (cursor) => {
      let attempts = 0;
      while (attempts < 3) {
        try {
          const url = new URL("https://slack.com/api/users.list");
          url.searchParams.set("limit", 1000);
          if (cursor) url.searchParams.set("cursor", cursor);
          console.log("Fetching page...");
  
          const res = await axios.get(url.toString(), {
            headers: { Authorization: `Bearer ${SLACK_TOKEN}` },
            validateStatus: () => true,
          });
  
          if (res.status !== 200 || !res.data.ok)
            throw new Error("Slack API failed");
  
          console.log("Success");
  
          const users = res.data.members.map((x) => ({
            id: x.id,
            name: x.name,
            real_name: x.real_name,
            tz: x.tz,
            tz_offset: x.tz_offset,
            title: x.profile.title,
            phone: x.profile.phone,
            start_date: x.profile.start_date,
            pronouns: x.profile.pronouns,
            image: x.profile.image_512,
            deleted: x.deleted,
          }));
  
          const nextCursor = res.data.response_metadata?.next_cursor || "";
          return { users, nextCursor };
        } catch (e) {
          attempts++;
          if (attempts >= 3) {
            console.error("Failed after 3 retries:", e);
            return { users: [], nextCursor: "" };
          }
        }
      }
      return { users: [], nextCursor: "" };
    };
  
    let cursor = "";
    do {
      const { users, nextCursor } = await fetchPage(cursor);
      allUsers.push(...users);
      cursor = nextCursor;
      if (cursor) await delay(2000); // throttle
    } while (cursor);
  
    return allUsers;
  }
  

async function main() {
  users = await fetchAllUsers();
  fs.writeFileSync("users.json", JSON.stringify(users), "utf8");
  fs.writeFileSync("projectsfinal.json", JSON.stringify(projects), "utf8");
}

async function mainStarter() {
  await main();
}

mainStarter();
