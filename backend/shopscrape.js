const parser = require("node-html-parser");
const fs = require("fs");
let env = {};
let r = fs.readFileSync("environment.txt", "utf-8").split("\n");
r.forEach((e) => {
  env[e.split("===")[0]] = e.split("===")[1];
});
const myCookie = env.COOKIE;
async function start() {
  let r;
  let response = await fetch(`https://summer.hackclub.com/shop`, {
    method: "GET",
    headers: {
      Cookie: myCookie,
    },
  });
  r = await response.text();
  fs.writeFileSync("cache/shop.html", r, "utf8");
  r = fs.readFileSync("cache/shop.html", "utf-8");
  const parsed = parser.parse(r);
  let result = "title;\tdesc;\tcoins;\thours\n";
  for (const div of parsed.querySelectorAll(".card-with-gradient")) {
    if (div.querySelector("h3") != null) {
      const title = div.querySelector("h3").textContent;
      const desc = div.querySelector(".text-gray-700").textContent;
      const hours = div
        .querySelector(".text-xs")
        .textContent.split(" ")[0]
        .replace("≈", "");
      const coins = div.querySelector(
        ".absolute.top-2.right-2.text-lg"
      ).textContent;

      result +=
        title.trim() +
        ";\t" +
        desc.trim() +
        ";\t" +
        coins.trim() +
        ";\t" +
        hours.trim() +
        "\n";
    }
  }
  fs.writeFileSync("shop.csv", result, "utf-8");
}

async function wait() {
  await start();
}

wait();
