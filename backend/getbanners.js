const fs = require("fs");
const parser = require("node-html-parser");
const startPage = 106;
const endPage = 150;
const wait = 10000; // Wait ten second coz we dont wanna hang the api
const resultPath = "banners.json";
let allProjects = {};
const myCookie =
  "ahoy_visitor=1a4cb2c8-62be-462a-a12c-bc303162a674; perf_dv6Tr4n=1; ahoy_visit=c72255ad-1f18-4c1a-a9a5-d4d7f65d7c25; _journey_session=dRYnPktXUMe846DaCjApUiyHLq7aPi6hPG%2Fhl2ZilLU%2F1x4WvV2OPmxm8DDOf98J0pmisf0nCp7911yteiBFMZB9LLyqPb%2F3I8kGUmx9e8KbZEi07Qmwq87298nTZrl59qw%2F0Bpge8xSPicWAhiimCTgn7ld3R1PHUa1kISUrV5%2Bp7uwLoUPv%2BAeH6xkGJMm4ilnVGZ9udxtKIEnMmFVWPY9CH865KuacrNVXKKoyiyU%2FCnjAGPXzCtjmXD0AOrK56WqbQgD%2FtcTA5u%2FVGoLKk12oR5peqGukyQ4sF7WaXfJIefwu9D9DxVtChNzbajRghamsF0A6e33x2nJIPHnUMwbOYyqw8ZV93J4JijPI%2FSJIKCo%2BPr7LkA%2FKpGXvvmO0BCM0ITfkSl3Id3FhwjmHdtMK%2B00O9lO--WHf5QJtNyzUgKiJb--EotlmTHET%2BlfNjHmNonWeg%3D%3D";
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
  console.log(`Processed ${endPage - startPage + 1} new pages and found ${Object.keys(allProjects).length} projects`);
}

function parseImages(dat) {
  let html = parser.parse(dat);
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
    allProjects[projectId] = {
      imageUrl,
      author: info[0].replace(/^by /, "").trim(),
      devlogs: info[1].replace(/ devlogs/, "").trim(),
      time: info[2].trim(),
    };
  });
}
async function fetchPage(page) {
  if (fs.existsSync(`./cache/page${page}.html`)) {
    return fs.readFileSync(`./cache/page${page}.html`, "utf8");
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
    return data;
  }
  return "";
}
start();
