import { useState, useEffect } from "react";
import { dummyNewsData, type NewsItem } from "../../data/dummyData";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";

// Fallback high-resolution editorial imagery for items with null image
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80"
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalItems = dummyNewsData.length;

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, totalItems]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  return (
    <section 
      className="relative w-full lg:w-[90%] m-auto h-[calc(100vh-10rem)] min-h-[500px] overflow-hidden bg-stone-950 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {dummyNewsData.map((item: NewsItem, index: number) => {
        const isActive = index === currentIndex;
        const itemImage = item.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

        return (
          <div
            key={item.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Full-screen Background Image */}
            <img
              src={itemImage}
              alt={item.imageAlt || item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Dark Gradient Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />

            {/* Overlay Content Box */}
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-16 lg:p-24 text-white max-w-6xl">
              
              {/* Timestamp / Meta Tag */}
              <div className="flex items-center gap-3 mb-4 text-xs font-mono text-stone-300">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#3cd9b3]">
                  Breaking News
                </span>
                <span>{item.time}</span>
              </div>

              {/* News Title - ALWAYS VISIBLE */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-4 drop-shadow-md">
                {item.title}
              </h1>

              {/* REVEALED ON HOVER: Description & View News Button */}
              <div className="grid transition-all duration-500 ease-in-out grid-rows-[0fr] group-hover:grid-rows-[1fr] opacity-0 group-hover:opacity-100">
                <div className="overflow-hidden space-y-5 pt-1">
                  <p className="text-stone-200 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-3xl drop-shadow-sm">
                    {item.description}
                  </p>

                  <div className="pt-2">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-stone-900 font-medium text-base rounded-full hover:bg-[#3cd9b3] hover:text-stone-950 transition-all duration-200 shadow-xl active:scale-95"
                    >
                      <span>View News</span>
                      <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
      })}

      {/* Floating Prev & Next Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 hover:bg-white hover:text-stone-900 transition-all duration-200 shadow-lg active:scale-95"
        aria-label="Previous Slide"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 hover:bg-white hover:text-stone-900 transition-all duration-200 shadow-lg active:scale-95"
        aria-label="Next Slide"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Bottom Dot Indicators */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-2.5 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
        {dummyNewsData.map((_, dotIndex: number) => (
          <button
            key={dotIndex}
            onClick={() => setCurrentIndex(dotIndex)}
            className={`transition-all duration-300 rounded-full ${
              dotIndex === currentIndex
                ? "w-8 h-2.5 bg-[#3cd9b3]"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white"
            }`}
            aria-label={`Go to slide ${dotIndex + 1}`}
          />
        ))}
      </div>

    </section>
  );
}