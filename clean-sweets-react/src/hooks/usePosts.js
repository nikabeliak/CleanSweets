import { useState, useEffect } from 'react';
import { ARTICLES } from '../data/articles';

const CATEGORIES = ['דל בקלוריות', 'לסכרתיים וקטוגנים', 'ללא לקטוז', 'עשיר בחלבון'];

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/posts.json')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { posts, loading, categories: CATEGORIES };
}

export function useArticles() {
  return ARTICLES;
}
