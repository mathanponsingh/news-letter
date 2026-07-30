export interface NewsItem {
  id: string;
  title: string;
  link: string;
  time: string;
  description: string;
  image: string | null;
  imageAlt: string | null;
  createdAt: string;
}

export const dummyNewsData: NewsItem[] = [
  {
    id: "6a6add7db937a9b56697b6ff",
    title: "Australia begins legal action against Telegram over alleged pro-terrorist content",
    link: "https://news.google.com/rss/articles/CBMizwFBVV95cUxQUFZRU0p3YlRBMlhhaUZfVGRwZ0JTV3V5TjhxNmd3b1RlaW4xZVNqVFBvMmhZSTJ2SllYTEYwOGZJbVFRMmtvVG8yYWFFbFp0NnZ5UXl3LU5W",
    time: "Thu, 30 Jul 2026 00:23:00 GMT",
    description: "Australian regulators have initiated formal legal proceedings targeting Telegram for refusing to remove content linked to illegal operations and extremist propaganda.",
    image: "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Digital legal concept with smartphone",
    createdAt: "2026-07-30T00:23:00.000+00:00"
  },
  {
    id: "6a6add7db937a9b56697b6fe",
    title: "Tech Giants Announce Unified AI Safety Standard for Web Applications",
    link: "https://news.google.com/rss/articles/CBMiYEFVV95cUxRNXJ3cExHZEVibVJRWmVRMm0xM0Q3SGFvdnJqQmVqdzFFVG5aTGV6aXR1Z3p6aUx5WUZoU0V3YkhfSjRnckdYOHJIdlZ5Zmd0Ymt1Y1NudjBR",
    time: "Thu, 30 Jul 2026 01:15:00 GMT",
    description: "Leading technology companies have agreed upon a shared framework to standardize model alignment, data privacy, and web integration guidelines.",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Abstract artificial intelligence network illustration",
    createdAt: "2026-07-30T01:15:00.000+00:00"
  },
  {
    id: "6a6add7db937a9b56697b6fd",
    title: "Global Renewable Energy Generation Reaches Record High in Q2 2026",
    link: "https://news.google.com/rss/articles/CBMiZkFBVV95cUxNVFRpTU96cDFnQUU4bUdLQ3pTSEpyTmlyNEp2TGJzSGJ1cGlLVTJtUWx0OEEySWltdk5vUGhrc01jRE5DdkFfaUt3N3J6eG1rSkx0VjF4T0h0",
    time: "Wed, 29 Jul 2026 21:45:00 GMT",
    description: "Solar and wind infrastructure expansion across Europe and Asia has propelled global green energy adoption past previous annual projections.",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Wind turbines silhouetted against sunset sky",
    createdAt: "2026-07-29T21:45:00.000+00:00"
  },
  {
    id: "6a6add7db937a9b56697b6fc",
    title: "Breakthrough in Quantum Semiconductor Manufacturing Reported by European Lab",
    link: "https://news.google.com/rss/articles/CBMicEFVV95cUxSYnE4YlVndzRDTlJ2TG1QeXp0b1dmdlh5cFNpMnBaaHh5Nm1YMmprNDJtdndKVDhXUGZ1RWV5X2J5YkZId21QVWJjRG1sM3Q4T3A3S0VvMUE",
    time: "Wed, 29 Jul 2026 18:30:00 GMT",
    description: "Researchers achieve room-temperature quantum qubit stability using standard silicon-graphene substrate manufacturing techniques.",
    image: null,
    imageAlt: null,
    createdAt: "2026-07-29T18:30:00.000+00:00"
  },
  {
    id: "6a6add7db937a9b56697b6fb",
    title: "Central Banks Test Cross-Border Digital Currency Settlement Platform",
    link: "https://news.google.com/rss/articles/CBMiaEFVV95cUxROWt4U000T0trRFFaT1JpU0xKbk0yNWN3bWRpYjFFa0U1eUxrdWRzS0M0TllUaFl1NlJ0d2xPZndXNGplNWZlRWl5M1V5TmhvZUp6aU5QOHc",
    time: "Wed, 29 Jul 2026 15:10:00 GMT",
    description: "A consortium of international financial institutions has launched real-time trial settlements utilizing decentralized ledger protocols.",
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Digital currency data graph",
    createdAt: "2026-07-29T15:10:00.000+00:00"
  },
  {
    id: "6a6add7db937a9b56697b6fa",
    title: "Open Source Alliance Releases High-Performance Web Engine Framework",
    link: "https://news.google.com/rss/articles/CBMiZEFBVV95cUxQTTNkVmlUazFXVW15Zmd1OGZqOG83ZlhKMW1vYTVYTXo2b2V2YnlzN001TGZqQnd1SEpSMGFXOHRsaHRnSHctdmJnSHIyb2N4cTV0S0dYdkE",
    time: "Wed, 29 Jul 2026 12:00:00 GMT",
    description: "Designed for ultra-low latency, the new engine promises 40% reduced memory overhead for enterprise web applications.",
    image: null,
    imageAlt: null,
    createdAt: "2026-07-29T12:00:00.000+00:00"
  }
];

export default dummyNewsData;
