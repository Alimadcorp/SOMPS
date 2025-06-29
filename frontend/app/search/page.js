import { Suspense } from "react";
import SearchContent from "../../components/searchContent";
import LoadingSkeleton from "@/components/loading";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const q = params.q || "SOMPS";
  const msg = params.msg;
  
  return {
    title: "SOMPS Search",
    description: `Search results for ${q || msg}`,
    openGraph: {
      title: "SOMPS Search",
      description: `Search results for ${q || msg}`,
      images: [
        `https://somps.vercel.app/search/image?${q ? "q" : "msg"}=${encodeURIComponent(q || msg)}`,
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [
        `https://somps.vercel.app/search/image?${q ? "q" : "msg"}=${encodeURIComponent(q || msg)}`,
      ],
    },
  };
}

export default function Page() {
  return (
    <div className="flex flex-col h-screen font-[family-name:var(--font-geist-sans)]">
      <Suspense fallback={<LoadingSkeleton />}>
        <SearchContent />
      </Suspense>
    </div>
  );
}