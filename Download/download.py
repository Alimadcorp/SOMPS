import os
import yt_dlp

start = 77
end = 0

os.makedirs("down", exist_ok=True)

with open("videos.txt") as f:
    urls = [line.strip() for line in f if line.strip()]

if end == 0 or end > len(urls):
    end = len(urls)

existing_titles = {
    " ".join(f.split()[1:-1])
    for f in os.listdir("down")
    if f.endswith(".mp4")
}

for index in range(start - 1, end):
    url = urls[index]
    with yt_dlp.YoutubeDL({'quiet': True}) as ydl:
        info = ydl.extract_info(url, download=False)
        title = info['title'][:80].strip()

    if title in existing_titles:
        print(f"Skipping '{title}' (already exists)")
        continue

    outtmpl = f'down/{index + 1} {title}.%(ext)s'
    ydl_opts = {
        'outtmpl': outtmpl,
        'format': 'bestvideo[height=720]+bestaudio/best[height=720]/bestvideo+bestaudio/best',
        'merge_output_format': 'mp4',
        'quiet': False,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
