import React, { useEffect, useState } from "react";
import Post from "../Post";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [sortedPosts, setSortedPosts] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt"); // Default sorting by createdAt
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/post')
      .then(response => response.json())
      .then(posts => {
        setPosts(posts);
        setSortedPosts(posts);
      })
      .catch(error => console.error("Error fetching posts:", error));
  }, []);

  // Function to sort posts by created time
  const sortByCreatedAt = () => {
    const sorted = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setSortedPosts(sorted);
    setSortBy("createdAt");
  };

  // Function to sort posts by upvotes count
  const sortByUpvotes = () => {
    const sorted = [...posts].sort((a, b) => b.upvotes - a.upvotes);
    setSortedPosts(sorted);
    setSortBy("upvotes");
  };

  // Function to handle search by title
  const handleSearch = () => {
    if (searchTerm) {
      const result = posts.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()));
      setSearchResult(result);
    } else {
      setSearchResult([]);
    }
  };

  return (
    <div>
         <div className="searchBar">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="sortBy">
        <button onClick={sortByCreatedAt}>Sort by Created Time</button>
        <button onClick={sortByUpvotes}>Sort by Upvotes</button>
      </div>
      <div className="sort">Sorting by: {sortBy}</div>
      {searchResult.length > 0 ? (
        searchResult.map(post => (
          <Post key={post._id} {...post} />
        ))
      ) : (
        sortedPosts.map(post => (
          <Post key={post._id} {...post} />
        ))
      )}
    </div>
  );
}
