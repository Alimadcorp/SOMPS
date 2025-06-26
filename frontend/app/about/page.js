import { Suspense } from "react";
import AboutContent from "../../components/about-content";
import LoadingSkeleton from "@/components/loading";

export const metadata = {
  title: "About - SOMPS",
  description: "Learn more about the Summer Of Making Projects Search engine",
};

export default function AboutPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AboutContent />
    </Suspense>
  );
}
