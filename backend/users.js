const fs = require("fs");
const startPage = 1;
const endPage = 2000;
const wait = 500;
const resultPath = "user.json";
let allUsers = {};
let initialLength = 0;
let env = {};
let r = fs.readFileSync("environment.txt", "utf-8").split("\n");
r.forEach((e) => {
  env[e.split("===")[0]] = e.split("===")[1];
});
const myCookie = env.COOKIE;
// Get a cookie from the soc website by inspecting the Cookie header of any web request sent to the same domain
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function start() {
  allUsers = JSON.parse(fs.readFileSync(resultPath));
  initialLength = Object.keys(allUsers).length;
  const promises = [];

  for (let i = startPage; i <= endPage; i++) {
    const promise = fetchPage(i).then((dat) => {
      parseData(dat);
      console.log(`Processed ${i}`);
    });
    promises.push(promise);
    await delay(wait);
  }

  await Promise.all(promises);
  fs.writeFileSync(resultPath, JSON.stringify(allUsers));
  console.log(
    `Processed ${endPage - startPage + 1} new pages and found ${
      Object.keys(allUsers).length
    } users`
  );
  console.log(
    `Increase in length: ${Object.keys(allUsers).length - initialLength}`
  );
}

function parseData(dat) {
  let thisusers = {};
  if(dat.data == {}){
    return;
  }
  dat.data.forEach((el) => {
    const uid = el.id;
    allUsers[uid] = thisusers[uid] = el;
  });
  fs.writeFileSync(resultPath, JSON.stringify(allUsers));
}

async function fetchPage(page, retries = 3) {
  const retryDelay = 2000;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        `https://summer.hackclub.com/api/v1/users?page=${page}`,
        {
          method: "GET",
          headers: {
            Cookie: myCookie,
            accept: "application/json",
            referer: "https://summer.hackclub.com/explore",
            "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "Windows",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "turbo-frame": "load-more-users",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
          },
        }
      );

      if (response.status === 101) {
        console.warn(`⚠️ Got 101 Switching Protocols at page ${page}`);
        return { data: {}, previous: null };
      }

      if (response.ok) {
        const data = await response.json();
        return { data: data.users || [], previous: "" };
      }

      console.warn(`⚠️ Failed at page ${page}, status ${response.status}`);
    } catch (e) {
      console.warn(`⚠️ Attempt ${attempt} failed at page ${page}: ${e.message}`);
    }

    if (attempt < retries) {
      console.log(`🔁 Retrying page ${page} in ${retryDelay}ms...`);
      await delay(retryDelay);
    }
  }

  console.error(`❌ Gave up on page ${page} after ${retries} attempts`);
  return { data: {}, previous: "" };
}

async function start() {
  allUsers = JSON.parse(fs.readFileSync(resultPath));
  initialLength = Object.keys(allUsers).length;

  for (let i = startPage; i <= endPage; i++) {
    const dat = await fetchPage(i);
    parseData(dat);
    console.log(`✅ Processed ${i}`);
    await delay(wait);
  }

  fs.writeFileSync(resultPath, JSON.stringify(allUsers));
  console.log(
    `Processed ${endPage - startPage + 1} new pages and found ${
      Object.keys(allUsers).length
    } users`
  );
  console.log(
    `Increase in length: ${Object.keys(allUsers).length - initialLength}`
  );
}

start();
