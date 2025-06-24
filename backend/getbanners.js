const fs = require("fs");
const parser = require("node-html-parser");
const startPage = 160;
const endPage = 160;
const wait = 5000; // Wait five second instead of ten coz we dont wanna hang the api yet we impatient lil goobers
const replacePrevious = false;
const resultPath = "banners.json";
let allProjects = {};
let env = {};
let r = fs.readFileSync("environment.txt", "utf-8").split("\n");
r.forEach(e => {
  env[e.split("===")[0]] = e.split("===")[1];
});
const myCookie = env.COOKIE;
// Get a cookie from the soc website by inspecting the Cookie header of any web request sent to the same domain
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function start() {
  allProjects = JSON.parse(fs.readFileSync(resultPath));
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
}

function parseImages(dat) {
  let thisProjects = {};
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
  if (dat.previous) {
    if (dat.data != dat.previous) {
      let prevProjects = [];
      let tProjects = [];
      for(let i = 0; i < Object.keys(thisProjects).length; i++){
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
        if(!tProjects.includes(projectId)) {
          console.log(`New Project Id: ${projectId}`);
          if(!Object.keys(allProjects).includes(projectId)) {
            console.log(`Actually New Project Id: ${projectId}`);
          }
        }
      });
    }
  }
}
async function fetchPage(page) {
  let previous;
  if (fs.existsSync(`./cache/page${page}.html`)) {
    if (!replacePrevious) {
      return { "data": fs.readFileSync(`./cache/page${page}.html`, "utf8") };
    } else {
      previous = fs.readFileSync(`./cache/page${page}.html`, "utf8");
    }
  }
  const response = await fetch(
    `https://summer.hackclub.com/explore.turbo_stream?page=${page}&tab=gallery`,
    {
      method: "GET",
      headers: {
        Cookie: myCookie,
      },
    }
  );
  console.log(response.status);
  if (response.ok) {
    const data = await response.text();
    console.log(data.length);
    fs.writeFileSync(`./cache/page${page}.html`, data, "utf8");
    return { data, previous };
  }
  return "";
}
start();
