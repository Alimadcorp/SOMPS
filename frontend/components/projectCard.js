"use client";

import { Code2, Play, Clock, MapPin, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
export default function ProjectCard({ project, highlight }) {
  let highlights = highlight.replace(/[_\-]/g, " ").split(" ");
  const team_id = "T0266FRGM";
  const {
    id,
    title,
    description,
    author_real_name,
    author_pfp,
    slack_id,
    created_at,
    time,
    devlogs,
    author_timezone,
    author_pronouns,
    repo_link,
    demo_link,
    imageUrl,
  } = project || {};
  const smoller = title.length > 50;
  function highlightText(text, highlights) {
    if (!text || typeof text !== "string") return text || "";
    if (!highlights || !Array.isArray(highlights) || highlights.length === 0)
      return text;
    const validHighlights = highlights
      .filter((h) => h && typeof h === "string" && h.trim().length > 0)
      .map((h) => h.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (validHighlights.length === 0) return text;
    const regex = new RegExp(`(${validHighlights.join("|")})`, "gi");
    const parts = text.split(regex);
    return parts.map((chunk, i) => {
      const isHighlight = validHighlights.some((h) =>
        new RegExp(`^${h}$`, "i").test(chunk)
      );
      return isHighlight ? (
        <span
          key={i}
          className="bg-[#9dff0048] font-semibold px-0.25 py-0.25 rounded-md shadow-sm"
        >
          {chunk}
        </span>
      ) : (
        chunk
      );
    });
  }
  const createdAgo = created_at
    ? formatDistanceToNow(new Date(created_at), { addSuffix: true })
    : "Unknown";
  const displayTimezone = author_timezone
    ? author_timezone.split("/")[1]?.replace("_", " ") || author_timezone
    : null;
  let displayDevlogs = null;
  if (typeof devlogs == "string" && devlogs != "0") {
    displayDevlogs = parseInt(devlogs);
  }
  const displayTime = time || null;

  return (
    <div className="group relative w-full h-[250px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
      <div className="absolute inset-0">
        <img
          src={
            imageUrl?.startsWith("/")
              ? `https://summer.hackclub.com${imageUrl}`
              : imageUrl ||
                "https://client-of-making.quntem.co.uk/public/banner-placeholder.png"
          }
          alt={title ? `${title} project banner` : "Project banner"}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-103"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>
      <div className="absolute top-1 right-4 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {repo_link && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(repo_link, "_blank");
            }}
            className="p-2.5 rounded-full bg-black/90 backdrop-blur-md border border-white/20 hover:bg-black/30 hover:scale-110 transition-all duration-200 cursor-pointer shadow-lg"
            title="View Repository"
          >
            <Code2 size={18} className="text-white" />
          </button>
        )}
        {demo_link && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(demo_link, "_blank");
            }}
            className="p-2.5 rounded-full bg-black/90 backdrop-blur-md border border-white/20 hover:bg-black/30 hover:scale-110 transition-all duration-200 cursor-pointer shadow-lg"
            title="View Demo"
          >
            <Play size={18} className="text-white" />
          </button>
        )}
      </div>

      <a
        href={id ? `https://summer.hackclub.com/projects/${id}` : "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 flex flex-col justify-end h-full p-6 text-white hover:text-white transition-colors duration-200"
        suppressHydrationWarning
      >
        {smoller ? (
          <h3 className="text-l font-bold leading-tight mb-2 drop-shadow-lg">
            {title ? highlightText(title, highlights) : "Untitled Project"}
          </h3>
        ) : (
          <h2 className="text-2xl font-bold leading-tight mb-2 drop-shadow-lg">
            {title ? highlightText(title, highlights) : "Untitled Project"}
          </h2>
        )}
        <p className="text-sm leading-relaxed line-clamp-2 opacity-95 mb-4 drop-shadow-sm">
          {description
            ? highlightText(description, highlights)
            : "No description available"}
        </p>
        <div
          className="flex items-center gap-1 mb-4"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={
              slack_id ? `slack://user?team=${team_id}&id=${slack_id}` : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:opacity-80 transition-opacity duration-200"
          >
            {author_pfp ? (
              <img
                src={author_pfp || "/placeholder.svg"}
                alt={author_real_name || "Author"}
                width={36}
                height={36}
                className="rounded-full border-2 border-white/40 shadow-lg"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                <span className="text-xs font-medium">
                  {author_real_name?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
            )}
            <span className="text-sm font-medium drop-shadow-sm">
              {author_real_name
                ? highlightText(author_real_name, highlights)
                : "Anonymous"}
            </span>
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-xs text-white/80">
          {displayDevlogs !== null && (
            <div className="flex items-center gap-1">
              <BookOpen size={12} />
              <span>
                {displayDevlogs} devlog{displayDevlogs !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {displayTime && (
            <>
              {displayDevlogs !== null && (
                <span className="text-white/40">•</span>
              )}
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{displayTime}</span>
              </div>
            </>
          )}

          {created_at && (
            <>
              {(displayDevlogs !== null || displayTime) && (
                <span className="text-white/40">•</span>
              )}
              <span>Created {createdAgo}</span>
            </>
          )}
          {author_pronouns && (
            <>
              {(true) && (
                <span className="text-white/40">•</span>
              )}
              <span>{author_pronouns}</span>
            </>
          )}
          {displayTimezone && (
            <>
              {(displayDevlogs !== null || displayTime || created_at) && (
                <span className="text-white/40">•</span>
              )}
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span>{displayTimezone}</span>
              </div>
            </>
          )}
        </div>
      </a>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
    </div>
  );
}
