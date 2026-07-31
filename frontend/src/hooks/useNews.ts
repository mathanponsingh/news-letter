import { useState, useEffect } from "react";
import type { NewsItem } from "../types";
import api from "../api/axios";

export function useNews(category: string = "/technology") {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get<NewsItem[]>(category);
        setNewsData(response.data);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to fetch news. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  return { newsData, isLoading, error };
}
