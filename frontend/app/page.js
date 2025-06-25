'use client';
import Image from "next/image";
import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const handleSearch = () => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex flex-col min-h-screen justify-between items-center px-6 pt-20 pb-10 text-center font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-10 items-center justify-center w-full">
        <div className="flex flex-col gap-3">
          <h1 className="text-5xl font-bold tracking-tight">SOMPS</h1>
          <p className="text-base text-muted-foreground">
            <b>S</b>ummer <b>O</b>f <b>M</b>aking <b>P</b>roject <b>S</b>earch
          </p>
        </div>

        <div className="relative w-[75vw] max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={24} />
          <input
            type="text"
            placeholder="Type something to get started..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-lg pl-12 pr-4 py-4 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        <button
          onClick={handleSearch}
          className="rounded-full border border-transparent transition-colors bg-foreground text-background active:bg-[#0c0c0c] active:border-2 active:border-cyan-50 active:text-foreground hover:bg-[#dcdcdc] font-bold text-sm h-12 px-8 cursor-pointer"
        >
          Search
        </button>
      </main>

      <div className="w-full max-w-2xl mt-10">
        <hr className="border-t border-neutral-300 dark:border-neutral-700 my-6" />
        <footer className="text-sm text-muted-foreground flex justify-center items-center gap-2">
          <a
            href="https://alimad.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:underline-offset-4 flex items-center gap-2"
          >
            <Image
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
              aria-hidden
            />
            Made with ♥️ by Muhammad Ali
          </a>
        </footer>
      </div>
    </div>
  );
}
