import { useNews } from "../../hooks/useNews";
import { Hero } from "./Hero";
import { NewsList } from "./NewsList";

export function Home() {
  const { newsData, isLoading, error } = useNews("/technology");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-stone-400 font-mono text-sm">
        Loading latest news...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500 font-mono text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <Hero newsData={newsData} />
      <NewsList newsData={newsData} />
    </div>
  );
}