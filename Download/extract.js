const fs = require("fs")
const { JSDOM } = require("jsdom")

const html = fs.readFileSync("h.html", "utf8")
const dom = new JSDOM(html)
const document = dom.window.document

const items = document.querySelectorAll("div > div")

const result = Array.from(items).map(item => {
  const video = item.querySelector("iframe")?.src || item.querySelector("video")?.src || item.querySelector("img")?.src || null
  const links = item.querySelectorAll("a")
  const github = Array.from(links).find(a => a.href.includes("github.com"))?.href || null
  const modrinth = Array.from(links).find(a => a.href.includes("modrinth.com"))?.href || null
  return { video, github, modrinth }
})

fs.writeFileSync("submissions.json", JSON.stringify(result, null, 2))
console.log("Done! Saved to submissions.json")
