const fs = require("fs");

let users = JSON.parse(fs.readFileSync("users.json", "utf-8"));
let r = {};
const k = Object.keys(users);
for (let i = 0; i < k.length; i++) {
  if (users[k[i]].author_timezone == "Asia/Karachi") {
    r[k[i]] = users[k[i]];
    console.log(i);
  }
}
fs.writeFileSync("filtered.json", JSON.stringify(r, null, 2), "utf-8");
