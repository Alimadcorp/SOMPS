import { Suspense } from "react";
import LoadingSkeleton from "@/components/loading";
import StatsDashboard from "@/components/stats";
import { stats } from "@/data/stats";

export const metadata = {
  title: "Summer of Making Stats",
  description: `Last updated: ${new Date(stats.last_sync).toLocaleString()}`,
  openGraph: {
    title: "Summer of Making Stats",
    description: `Last updated: ${new Date(stats.last_sync).toLocaleString()}`,
    images: [
      `https://somps.alimad.xyz/stats/opengraph-image.png`,
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      `https://somps.alimad.xyz/stats/opengraph-image.png`,
    ],
  },
};

export default function StatsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <main className="font-geist text-center px-4 py-8">
        <h1 className="text-3xl font-semibold mb-4">Summer Of Making Stats</h1>
        <p className="text-m text-gray-300">
          Part of the{" "}
          <a
            href="/"
            className="text-sky-400 hover:text-sky-200 underline underline-offset-4 transition-all cursor-pointer"
          >
            Summer Of Making Project Search engine
          </a>
          ,<br />
          Made by{" "}
          <a
            href="https://alimad.xyz"
            target="_blank"
            className="text-sky-400 hover:text-sky-200 underline underline-offset-4 transition-all cursor-pointer"
          >
            Muhammad Ali
          </a>
        </p>
        <StatsDashboard stats={stats} />
      </main>
    </Suspense>
  );
}
