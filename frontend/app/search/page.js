import { Suspense } from "react";
import SearchContent from "../../components/searchContent";
import LoadingSkeleton from "@/components/loading";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const q = params.q || "SOMPS";
  
  return {
    title: "SOMPS Search",
    description: `Search results for ${q}`,
    openGraph: {
      title: "SOMPS Search",
      description: `Search results for ${q}`,
      images: [
        `https://somps.vercel.app/search/image?q=${encodeURIComponent(q)}`,
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [
        `https://somps.vercel.app/search/image?q=${encodeURIComponent(q)}`,
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