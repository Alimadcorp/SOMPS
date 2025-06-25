import { Suspense } from "react"
import SearchContent from "./searchContent"
import LoadingSkeleton from "@/components/loading.js"

/*export async function generateMetadata({ params, searchParams }) {
  const slug = searchParams.get("q") || null
  const wth = searchParams.get("wth") || null

  if (wth) {
    return {
      title: "SOMPS Search",
      description: `WTH what does ${wth} mean???`,
    }
  }
  return {
    title: "SOMPS Search",
    description: slug ? `Search results for ${slug}.` : "Type to search for SoM projects",
  }
}*/

export default function Page() {
  return (
    <div className="flex flex-col h-screen font-[family-name:var(--font-geist-sans)]">
      <Suspense fallback={<LoadingSkeleton />}>
        <SearchContent />
      </Suspense>
    </div>
  )
}
