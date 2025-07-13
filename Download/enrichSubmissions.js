const fs = require("fs")
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args))

async function getTitle(videoUrl, signal) {
  try {
    if (videoUrl.includes("youtube.com/embed/")) {
      const videoId = videoUrl.split("/embed/")[1].split("?")[0]
      const oembedURL = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      const res = await fetch(oembedURL, { signal })
      if (!res.ok) throw new Error("oEmbed failed")
      const data = await res.json()
      return data.title
    }

    const res = await fetch(videoUrl, { signal })
    const html = await res.text()
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
    if (titleMatch) return titleMatch[1].trim()
  } catch (e) {
    return null
  }
}

async function main() {
  const data = JSON.parse(fs.readFileSync("submissions.json", "utf8"))
  const result = []

  const controllers = data.map(() => new AbortController())
  const timeout = setTimeout(() => {
    console.log("Timeout hit! Aborting all fetches...")
    controllers.forEach(ctrl => ctrl.abort())
  }, 30000)

  const promises = data.map((entry, i) =>
    getTitle(entry.video, controllers[i].signal).then(title => {
      console.log(entry.video, "→", title)
      return { ...entry, title }
    })
  )

  const resolved = await Promise.allSettled(promises)
  clearTimeout(timeout)

  for (const r of resolved) {
    if (r.status === "fulfilled" && r.value) result.push(r.value)
  }

  fs.writeFileSync("submissions_with_titles.json", JSON.stringify(result, null, 2))
  console.log("Saved to submissions_with_titles.json")
}

main()
