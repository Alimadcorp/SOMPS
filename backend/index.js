const fs = require("fs");
const axios = require("axios");
let projects = [];
let users = {};
const cursors = [
  "",
  "dXNlcjpVMzJHUkIwN1A=",
  "dXNlcjpVNlZMTTJUNE0=",
  "dXNlcjpVQzhVOExRMEg=",
  "dXNlcjpVR1dKOUdBM1k=",
  "dXNlcjpVTU5BRUVHVjg=",
  "dXNlcjpVTksySzNLTDc=",
  "dXNlcjpVUUZRQlJTQTA=",
  "dXNlcjpVVE05RTA3OFI=",
  "dXNlcjpVMDExUDVQMFRUNw==",
  "dXNlcjpVMDE0R1JUNVBQRw==",
  "dXNlcjpVMDE1U0FMOTdGSA==",
  "dXNlcjpVMDE3QTk3VUdRUA==",
  "dXNlcjpVMDFBWU1FUEo5NA==",
  "dXNlcjpVMDFEVkRFTkM2Uw==",
  "dXNlcjpVMDFLQ0hYMU5LVQ==",
  "dXNlcjpVMDFTRTFZRjJGNA==",
  "dXNlcjpVMDIyNTJGNkI5UQ==",
  "dXNlcjpVMDI5MzdGTTFGVg==",
  "dXNlcjpVMDJEUVFBTEowUA==",
  "dXNlcjpVMDJMNjFNNVowUQ==",
  "dXNlcjpVMDJVNk00VTgwMA==",
  "dXNlcjpVMDNBMkI4MEZDMw==",
  "dXNlcjpVMDNQOUNXUFJLSw==",
  "dXNlcjpVMDQyVExKNks2Qw==",
  "dXNlcjpVMDRCUFVIS1NSSA==",
  "dXNlcjpVMDRHSzdRS0FBRQ==",
  "dXNlcjpVMDROOTQ3S0dBRg==",
  "dXNlcjpVMDU0RFIzSFFRTQ==",
  "dXNlcjpVMDVGR0FBVUE5NQ==",
  "dXNlcjpVMDVSTTFGUjRRTQ==",
  "dXNlcjpVMDYzUVY2QjhMRA==",
  "dXNlcjpVMDZFTEtNOVhVTg==",
  "dXNlcjpVMDZNSlFWTFJBUQ==",
  "dXNlcjpVMDZWNEpWN0JHOQ==",
  "dXNlcjpVMDc0Uzc4VDFHUQ==",
  "dXNlcjpVMDc4RU5VUFpLUA==",
  "dXNlcjpVMDc4WUZNVEhDWg==",
  "dXNlcjpVMDc5RzRLTldEVg==",
  "dXNlcjpVMDc5WjIwUlg0Tg==",
  "dXNlcjpVMDdBSEJBMDRRRw==",
  "dXNlcjpVMDdCRU5XUFRVWQ==",
  "dXNlcjpVMDdDUzJHOFBHUg==",
  "dXNlcjpVMDdEWDlTOVgxNw==",
  "dXNlcjpVMDdFVU1TSlM3NA==",
  "dXNlcjpVMDdGREY2SDRWQQ==",
  "dXNlcjpVMDdHRjdUQkZMNg==",
  "dXNlcjpVMDdKNVBDRkhRVw==",
  "dXNlcjpVMDdNMTZUNkNOVA==",
  "dXNlcjpVMDdNU0I0OFQyUQ==",
  "dXNlcjpVMDdOVjJNSEdNUA==",
  "dXNlcjpVMDdRRDYyUjAzRg==",
  "dXNlcjpVMDdTRkozU1dURA==",
  "dXNlcjpVMDdVNkJCRVQxQw==",
  "dXNlcjpVMDdVUlNKNUdVRQ==",
  "dXNlcjpVMDgwMDg4NFE5TA==",
  "dXNlcjpVMDgwUjFYR0hCOA==",
  "dXNlcjpVMDgxQzBTVU02Mw==",
  "dXNlcjpVMDgxUzJNTDhLMQ==",
  "dXNlcjpVMDgyMzE0RUtESw==",
  "dXNlcjpVMDgyNjBEOVEyVw==",
  "dXNlcjpVMDgyRE5SRzUyVA==",
  "dXNlcjpVMDgyUFAyUFRCOQ==",
  "dXNlcjpVMDgyVlBTQlNFQQ==",
  "dXNlcjpVMDgzNzVOMUIzMw==",
  "dXNlcjpVMDgzU1FOQVowUQ==",
  "dXNlcjpVMDg0VzNaQ1YwQQ==",
  "dXNlcjpVMDg1WEU4Q1RFMA==",
  "dXNlcjpVMDg2UUVGUEVSNA==",
  "dXNlcjpVMDg3QzEwSkQ1Wg==",
  "dXNlcjpVMDg4N0pFQjJITA==",
  "dXNlcjpVMDg5N0RZQTdKUg==",
  "dXNlcjpVMDhBQjZZOENMQg==",
  "dXNlcjpVMDhCOTQyUjE4VQ==",
  "dXNlcjpVMDhDUE5VR1RKUA==",
  "dXNlcjpVMDhFWTM1UVQyUg==",
  "dXNlcjpVMDhIUkRRUTVKUw==",
  "dXNlcjpVMDhMOVVRQktBNQ==",
  "dXNlcjpVMDhOQ0pFR1JNVw==",
];
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

async function fetchAllUsers(cursorsSubset) {
  //return JSON.parse(fs.readFileSync("users.json", "utf8"));

  const allUsers = [];
  const fetchPage = async (cursor) => {
    let attempts = 0;
    while (attempts < 3) {
      try {
        const url = new URL("https://slack.com/api/users.list");
        url.searchParams.set("limit", 1000);
        if (cursor) url.searchParams.set("cursor", cursor);
        console.log("fetching");

        const res = await axios.get(url.toString(), {
          headers: { Authorization: `Bearer ${SLACK_TOKEN}` },
          validateStatus: () => true,
        });

        if (res.status !== 200 || !res.data.ok)
          throw new Error("Slack API failed");

        console.log("success");
        return res.data.members.map((x) => {
          return {
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
          };
        });
      } catch (e) {
        attempts++;
        if (attempts >= 3) {
          console.error(e);
          return [];
        }
      }
    }
    return [];
  };

  for (const cursor of cursors) {
    const members = await fetchPage(cursor);
    allUsers.push(...members);
    await delay(2000);
  }

  return allUsers;
}

async function main() {
  users = await fetchAllUsers(cursors);
  fs.writeFileSync("users.json", JSON.stringify(users), "utf8");
  fs.writeFileSync("projectsfinal.json", JSON.stringify(projects), "utf8");
}

async function mainStarter() {
  await main();
}

mainStarter();
