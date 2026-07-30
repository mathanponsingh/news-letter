import { dummyNewsData, type NewsItem } from "../../data/dummyData";
import { ArrowUpRightIcon, ClockIcon, NewspaperIcon } from "@heroicons/react/24/outline";

// Fallback high-resolution images for items without image URL
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"
];

export function NewsList() {
  return (
    <section className="w-full lg:w-[90%] bg-white py-16 px-4 sm:px-6 lg:px-8 mx-auto font-sans">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-black pb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-xs font-mono uppercase tracking-widest mb-4">
            <NewspaperIcon className="w-3.5 h-3.5 text-[#3cd9b3]" />
            <span>Latest Feed</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-black">
            Publications & News
          </h2>
        </div>
        <p className="text-stone-600 text-sm sm:text-base font-light max-w-md leading-relaxed">
          Distraction-free analysis, technology breakthroughs, and global reporting formatted in a 2-column grid.
        </p>
      </div>

      {/* 2 News Per Row Grid Layout with FIXED Box Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {dummyNewsData.map((item: NewsItem, index: number) => {
          const itemImage = item.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

          return (
            <a href={item.link} key={item.id} target="_blank">
            <article
              className="group relative h-[480px] bg-white border border-black rounded-none overflow-hidden flex flex-col justify-between hover:border-black transition-colors duration-300"
            >
              {/* 100% Opacity Card Image */}
              <div className="relative w-full h-[260px] shrink-0 overflow-hidden border-b border-black">
                <img
                  src={itemImage}
                  alt={item.imageAlt || item.title}
                  className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-mono tracking-wider">
                  ISSUE #{index + 1}
                </div> */}
              </div>

              {/* Fixed Content Section with Overlay Hover Description */}
              <div className="relative flex-1 p-6 sm:p-8 flex flex-col justify-between bg-white overflow-hidden">
                
                {/* Meta & Title */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                    <ClockIcon className="w-3.5 h-3.5 text-black shrink-0" />
                    <span>{item.time}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-black leading-tight group-hover:text-stone-800 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                {/* Hover Reveal Description Overlay (Appears inside the fixed box without resizing the outer card) */}
                <div className="absolute inset-x-0 bottom-0 bg-white p-6 sm:p-8 border-t border-stone-200 transition-all duration-300 ease-in-out translate-y-full group-hover:translate-y-0 flex flex-col justify-between h-[210px] z-10">
                  <p className="text-stone-700 text-sm font-light leading-relaxed line-clamp-4">
                    {item.description}
                  </p>
                  
                  <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-black group-hover:text-[#3cd9b3] transition-colors"
                    >
                      <span>Read Article</span>
                      <ArrowUpRightIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Default Action Link (Shown when not hovering) */}
                <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-black transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowUpRightIcon className="w-4 h-4" />
                  </a>
                </div>

              </div>
            </article>
            </a>
          );
        })}

      </div>
    </section>
  );
}