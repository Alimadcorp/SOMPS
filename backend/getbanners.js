const fs = require("fs");
const myCookie =
  "ahoy_visitor=1a4cb2c8-62be-462a-a12c-bc303162a674; perf_dv6Tr4n=1; ahoy_visit=c72255ad-1f18-4c1a-a9a5-d4d7f65d7c25; _journey_session=dRYnPktXUMe846DaCjApUiyHLq7aPi6hPG%2Fhl2ZilLU%2F1x4WvV2OPmxm8DDOf98J0pmisf0nCp7911yteiBFMZB9LLyqPb%2F3I8kGUmx9e8KbZEi07Qmwq87298nTZrl59qw%2F0Bpge8xSPicWAhiimCTgn7ld3R1PHUa1kISUrV5%2Bp7uwLoUPv%2BAeH6xkGJMm4ilnVGZ9udxtKIEnMmFVWPY9CH865KuacrNVXKKoyiyU%2FCnjAGPXzCtjmXD0AOrK56WqbQgD%2FtcTA5u%2FVGoLKk12oR5peqGukyQ4sF7WaXfJIefwu9D9DxVtChNzbajRghamsF0A6e33x2nJIPHnUMwbOYyqw8ZV93J4JijPI%2FSJIKCo%2BPr7LkA%2FKpGXvvmO0BCM0ITfkSl3Id3FhwjmHdtMK%2B00O9lO--WHf5QJtNyzUgKiJb--EotlmTHET%2BlfNjHmNonWeg%3D%3D";
// Get a cookie from the soc website by inspecting the Cookie header of any web request sent to the same domain

async function start() {
  const dat = await fetchPage(1);

  fs.writeFileSync("page1.txt", dat, "utf8");
}
async function fetchPage(page) {
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
  }
  return data;
}
start();
