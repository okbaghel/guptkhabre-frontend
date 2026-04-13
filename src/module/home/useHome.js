import { useEffect, useState } from "react";
import { getPosts } from "../posts/postService";

export const useHome = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]); // empty
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const postData = await getPosts();

      setPosts(postData);
      setStories([]); // no API yet
    } catch (err) {
      console.error("HOME FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    posts,
    stories,
    loading,
    handleLike: () => {}, // dummy
  };
};