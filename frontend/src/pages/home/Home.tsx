import { Hero } from "./Hero";
import { NewsList } from "./NewsList";

export function Home() {
    return (
        <div className="space-y-12">
            <Hero />
            <NewsList />
        </div>
    );
}