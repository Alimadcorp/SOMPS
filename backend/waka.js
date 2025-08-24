#!/usr/bin/env node
const https = require("https");

const [, , hours, project] = process.argv;
const duration = parseFloat(hours) * 3600;
const body = JSON.stringify({
  time: Math.floor(Date.now() / 1000),
  duration,
  project: project || "manual"
});

const req = https.request(
  {
    method: "POST",
    hostname: "wakatime.com",
    path: "/api/v1/users/current/durations",
    auth: `eebfc0d4-8c8e-4724-a821-f5621a23fa4f:`,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body)
    }
  },
  res => {
    let data = "";
    res.on("data", chunk => (data += chunk));
    res.on("end", () => {
      console.log(res.statusCode, data);
    });
  }
);

req.on("error", console.error);
req.write(body);
req.end();
