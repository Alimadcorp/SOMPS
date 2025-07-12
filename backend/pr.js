const fs = require("fs");
const parser = require("node-html-parser");
const startPage = 1;
const endPage = 300;
const wait = 3500;
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
  if(dat == {}){
    return;
  }
  dat.forEach((el) => {
    const projectId = el.id;
    allProjects[projectId] = thisProjects[projectId] = el;
  });
  fs.writeFileSync(resultPath, JSON.stringify(allProjects));
}
async function fetchPage(page) {
  let response = { ok: false, status: 101 };
  try {
    response = await fetch(
      `https://summer.hackclub.com/api/v1/projects?page=${page}`,
      {
        method: "GET",
        headers: {
          //Cookie: myCookie,
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
    const data = await response.json();
    return { data: data.projects, previous: "" };
  } else {
    console.log(response.status);
  }
  return { data: {}, previous: ""};
}
start();
