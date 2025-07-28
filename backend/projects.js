const fs = require("fs");
const parser = require("node-html-parser");
const startPage = 1;
const endPage = 500;
const wait = 1500;
const resultPath = "projects.json";
let allProjects = {};
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
  allProjects = JSON.parse(fs.readFileSync(resultPath));
  initialLength = Object.keys(allProjects).length;
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
  fs.writeFileSync(resultPath, JSON.stringify(allProjects));
  console.log(
    `Processed ${endPage - startPage + 1} new pages and found ${
      Object.keys(allProjects).length
    } projects`
  );
  console.log(
    `Increase in length: ${Object.keys(allProjects).length - initialLength}`
  );
}

function parseData(dat) {
  let thisProjects = {};
  if(dat.data == {}){
    return;
  }
  dat.data.forEach((el) => {
    const projectId = el.id;
    allProjects[projectId] = thisProjects[projectId] = el;
  });
  fs.writeFileSync(resultPath, JSON.stringify(allProjects));
}
async function fetchPage(page) {
  let response;
  try {
    response = await fetch(
      `https://summer.hackclub.com/api/v1/projects?page=${page}`,
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
          "turbo-frame": "load-more-projects",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        },
      }
    );

    if (response.status === 101) {
      console.warn(`⚠️ Got 101 Switching Protocols at page ${page}`);
      const raw = await response.text();
      console.log("Raw 101 response:", raw.slice(0, 500)); // log preview
      return { data: {}, previous: null };
    }

    if (response.ok) {
      const data = await response.json();
      return { data: data.projects || [], previous: "" };
    } else {
      console.error(`Error at ${page}: Status ${response.status}`);
    }
  } catch (e) {
    console.error(`Fetch error at page ${page}:`, e.message);
  }

  return { data: {}, previous: "" };
}

start();
