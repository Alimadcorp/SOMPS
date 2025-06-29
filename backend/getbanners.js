const fs = require("fs");
const parser = require("node-html-parser");
const startPage = 1;
const endPage = 100;
const wait = 5000;// Wait five second instead of ten coz we dont wanna hang the api yet we impatient lil goobers
const replacePrevious = true;
const resultPath = "banners.json";
let allProjects = {};
let initialLength = 3873-117;
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
      parseImages(dat);
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

function parseImages(dat) {
  let thisProjects = {};
  if(dat.data == ""){
    return;
  }
  let html = parser.parse(dat.data);
  let divs = html.querySelectorAll(".flex.flex-col.h-full.gap-3");
  divs.forEach((el) => {
    let info = el
      .querySelector(".mb-2.line-clamp-3.text-sm")
      .innerHTML.trim()
      .split(" • ");
    const img = el.querySelector("img");
    const form = el.querySelector("form[action^='/projects/']");
    const imageUrl = img?.attrs.src || null;
    const action = form?.getAttribute("action") || "";
    const match = action.match(/\/projects\/(\d+)\//);
    const projectId = match ? match[1] : null;
    allProjects[projectId] = thisProjects[projectId] = {
      imageUrl,
      author: info[0].replace(/^by /, "").trim(),
      devlogs: info[1].replace(/ devlogs/, "").trim(),
      time: info[2].trim(),
    };
  });
  fs.writeFileSync(resultPath, JSON.stringify(allProjects));
  if (dat.previous) {
    let npi = [],
      anpi = [];
    if (dat.data != dat.previous) {
      let prevProjects = [];
      let tProjects = [];
      for (let i = 0; i < Object.keys(thisProjects).length; i++) {
        tProjects.push(Object.keys(thisProjects)[i]);
      }
      let html = parser.parse(dat.previous);
      let divs = html.querySelectorAll(".flex.flex-col.h-full.gap-3");
      divs.forEach((el) => {
        const form = el.querySelector("form[action^='/projects/']");
        const action = form?.getAttribute("action") || "";
        const match = action.match(/\/projects\/(\d+)\//);
        const projectId = match ? match[1] : null;
        prevProjects.push(projectId);
        if (!tProjects.includes(projectId)) {
          npi.push(`${projectId}`);
          if (!Object.keys(allProjects).includes(projectId)) {
            anpi.push(`${projectId}`);
          }
        }
      });
      if (npi.length > 0) {
        if (anpi.length > 0) {
          console.log(
            `Found ${npi.length} new and ${anpi.length} actually new projects`
          );
        } else {
          console.log(
            `Found ${npi.length} new projects`
          );
        }
      }
    }
  }
}
async function fetchPage(page) {
  let previous;
  if (fs.existsSync(`./cache/page${page}.html`)) {
    if (!replacePrevious) {
      return { data: fs.readFileSync(`./cache/page${page}.html`, "utf8") };
    } else {
      previous = fs.readFileSync(`./cache/page${page}.html`, "utf8");
    }
  }
  let response = { ok: false, status: 101 };
  try {
    response = await fetch(
      `https://summer.hackclub.com/explore.turbo_stream?page=${page}&tab=gallery`,
      {
        method: "GET",
        headers: {
          Cookie: myCookie,
        },
      }
    );
  } catch (e) {
    if (response.status == 500 || response.status == 404) {
      console.log("Error at " + page + ": " + response.status);
      return { data: "", previous: null };
    }
  }
  if (response.ok) {
    const data = await response.text();
    fs.writeFileSync(`./cache/page${page}.html`, data, "utf8");
    return { data, previous };
  } else {
    console.log(response.status);
  }
  return "";
}
start();
