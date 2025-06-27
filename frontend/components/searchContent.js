"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import ProjectCard from "@/components/projectCard.js";
import { projects as ProjectList } from "@/data/projects.js";
import levenshtein from "@/components/levenshtein";
import SortDropdown from "./dropdown.js";
import { stats as statss } from "@/data/stats.js";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const [cquery, setcQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [highlight, setHighlight] = useState([]);
  const [searchProgress, setSearchProgress] = useState(0);
  const [resultAmt, setResultAmt] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();
  const slackTzOffset = -offsetMinutes * 60;
  let maxS = 0;
  let minS = 0;

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const sort = searchParams.get("sort") || "";
    setQuery(q);
    setSortBy(sort);
    if (q) {
      searchProjects(q, sort);
    }
  }, [searchParams]);

  const searchProjects = async (q, sort = sortBy) => {
    setLoading(true);
    setHasSearched(true);
    setSearchProgress(0);
    const results = await search(q, sort);
    setProjects(results);
    setLoading(false);
    setSearchProgress(0);
  };

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const hours = timeStr.match(/(\d*)h/)?.[1] || 0;
    if (isNaN(hours)) return 0;
    const minutes = timeStr.match(/(\d*)m/)?.[1] || 0;
    if (isNaN(minutes)) return 0;
    return Number.parseInt(hours) * 60 + Number.parseInt(minutes);
  }

  const getSortScore = (project, sortType) => {
    switch (sortType) {
      case "devlogs":
        return (parseInt(project.devlogs) || 0) * 50;
      case "length":
        return (project.title.length || 0) * 50;
      case "name":
        return (parseInt(project.title) || 0) * 50;
      case "created_at_desc":
        return project.created_at
          ? new Date(project.created_at).getTime() / 1000000
          : 0;
      case "created_at_asc":
        const referenceDate = new Date(2025, 5, 10);
        let e = 0;
        if (project.created_at) {
          const createdTime = new Date(project.created_at).getTime();
          const diff = Math.abs(referenceDate.getTime() - createdTime);
          e = 1209600000 - diff;
        }
        return e;
      case "distance":
        let t = 0;
        if (project.timezone_offset != null) {
          const diff = Math.abs(project.timezone_offset - slackTzOffset);
          t = (50400 - diff) * 10;
        }
        return t;
      case "updated_at":
        return project.updated_at
          ? new Date(project.updated_at).getTime() / 1000000
          : 0;
      case "time":
        return parseTimeToMinutes(project.time) * 20;
      default:
        return 0;
    }
  };

  async function search(q, sort = "") {
    setcQuery(q);
    const scores = {};
    const rate = 100;
    const amount = 24;
    setHighlight(
      q.toLowerCase().replace(/[_-]/g, " ").split(" ").filter(Boolean)
    );
    minS = maxS = 0;
    const keys = Object.keys(ProjectList);
    setTotalProjects(keys.length);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const score = getScore(ProjectList[key], q, sort);
      if (score >= 5) scores[key] = score;

      if (i % rate === 0) {
        setSearchProgress(i + 1);
        await delay(25);
      }
    }
    let avg = minS + (maxS - minS) / 2;
    let sorted = Object.entries(scores)
      .filter(([_, score]) => {
        if (sort) {
          return true;
        } else {
          return score > avg;
        }
      })
      .sort((a, b) => b[1] - a[1]);
    setResultAmt(sorted.length);
    sorted = sorted.slice(0, amount).map(([key]) => ProjectList[key]);
    return sorted;
  }

  function getScore(project, inputQuery, sort = "") {
    if (!project || !inputQuery) return 0;

    let score = 0;

    if (sort) {
      score += getSortScore(project, sort);
    } else {
      if (
        inputQuery == project.name ||
        inputQuery == project.id ||
        inputQuery == project.slack_id ||
        inputQuery == project.author
      ) {
        return 750;
      }

      const q = inputQuery
        .toLowerCase()
        .replace(/[_-]/g, " ")
        .split(" ")
        .filter(Boolean);

      const lowPriority = `${project.description || ""} ${
        project.slack_id || ""
      } ${project.demo_url || ""}`
        .toLowerCase()
        .replace(/[_-]/g, " ")
        .split(" ");

      const highPriority = `${project.name || ""} ${project.title || ""} ${
        project.author || ""
      } ${project.author_name || ""} ${project.author_real_name || ""} ${
        project.id || ""
      }`
        .toLowerCase()
        .replace(/[_-]/g, " ")
        .split(" ");

      q.forEach((word) => {
        highPriority.forEach((target) => {
          if (word === target) score += 25;
          else if (target.includes(word) && word.length > 3) score += 20;
          else if (levenshtein(word, target) < 3) score += 10;
        });
        lowPriority.forEach((target) => {
          if (word.length > 2) {
            if (word === target) score += 12.5;
            else if (target.includes(word) && word.length > 3) score += 10;
          }
        });
      });
    }

    maxS = Math.max(maxS, score);
    minS = Math.min(minS, score);

    return score;
  }

  const handleSearch = () => {
    if (!query.trim()) {
      toast.error(`Can't search for nothing ¯\\_(ツ)_/¯`);
      return;
    }

    const params = new URLSearchParams();
    params.set("q", query.trim());
    if (sortBy) params.set("sort", sortBy);
    router.push(`/search?${params.toString()}`);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    if (query) {
      const params = new URLSearchParams();
      params.set("q", query);
      if (newSort) params.set("sort", newSort);
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const progressPercentage =
    totalProjects > 0 ? (searchProgress / totalProjects) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-950 bg-fixed text-gray-100">
      <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/50 portrait:h-auto h-[10vh] flex items-center w-full portrait:py-3">
        <div className="container mx-auto px-2 sm:px-3 w-full">
          <div className="flex items-center gap-3 portrait:flex-col portrait:gap-2 portrait:items-stretch">
            <a href="/" className="group portrait:self-center">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-200">
                SOMPS
              </h1>
            </a>

            <div className="flex flex-1 max-w-2xl gap-2 portrait:flex-col portrait:gap-2 portrait:max-w-none">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search projects..."
                  className="w-full pl-8 pr-3 py-2 text-sm bg-gray-900/50 border border-gray-700/50 rounded-lg focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500"
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2 portrait:flex-col portrait:gap-2">
                <button
                  onClick={handleSearch}
                  disabled={loading || !query.trim()}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-400 rounded-lg transition-all duration-200 min-w-[70px] portrait:min-w-0"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    "Search"
                  )}
                </button>
                <SortDropdown
                  onSortChange={handleSortChange}
                  currentSort={sortBy}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {loading && (
        <div className="sticky top-[10vh] z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/30">
          <div className="container mx-auto px-2 sm:px-3 py-2">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>
                Searching {searchProgress} of {totalProjects} projects
              </span>
              <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-2 sm:px-3 py-3">
        {!query && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <h2 className="text-lg font-semibold text-gray-200 mb-1">
              Search Projects
            </h2>
            <p className="text-sm text-gray-400">
              Enter keywords to find projects
            </p>
          </div>
        )}

        {query && !loading && hasSearched && projects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-800 flex items-center justify-center">
              <Search className="h-6 w-6 text-gray-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-200 mb-1">
              No Results
            </h2>
            <p className="text-sm text-gray-400">
              No projects found for{" "}
              <span className="text-gray-200 font-medium">
                "{sortBy || cquery}"
              </span>
            </p>
          </div>
        )}

        {Array.isArray(projects) &&
          query &&
          !loading &&
          projects.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-900/30 rounded-lg border border-gray-800/30">
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    <span className="text-blue-400 font-semibold">
                      {resultAmt}
                    </span>{" "}
                    result
                    {resultAmt !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-gray-400">
                    for{" "}
                    <span className="text-gray-300">"{sortBy || cquery}"</span>
                  </p>
                </div>
                <div className="text-xs text-gray-500 px-2 py-1 bg-gray-800/50 rounded border border-gray-700/30">
                  {resultAmt} of {Object.keys(ProjectList).length}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="transition-transform duration-200 hover:scale-[1.02]"
                  >
                    <ProjectCard project={project} highlight={query} />
                  </div>
                ))}
              </div>
            </div>
          )}
      </main>
      <footer className="m-auto bottom-0 static w-full h-10">
        <div className="text-center text-xs text-gray-500 pt-3 border-t border-gray-800/50">
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p>Last updated: {new Date(statss.last_sync).toLocaleString()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
