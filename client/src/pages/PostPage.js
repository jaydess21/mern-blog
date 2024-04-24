import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import "../App.css";
import { FaThumbsUp } from "react-icons/fa";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    // Fetch post data based on ID from URL
    fetch(`http://localhost:4000/post/${id}`)
      .then((response) => response.json())
      .then((postInfo) => {
        setPostInfo(postInfo);
        setUpvotes(postInfo.upvotes || 0); // Set initial upvotes count
      })
      .catch((err) => console.error("Error fetching post:", err));
  }, [id]);

  const handleDelete = () => {
    // Handle post deletion
    fetch(`http://localhost:4000/post/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          window.location.replace("/"); // Redirect to home page
        } else {
          throw new Error("Failed to delete post");
        }
      })
      .catch((error) => console.error("Error deleting post:", error));
  };

  const handleUpvote = () => {
    fetch(`http://localhost:4000/post/${id}/upvote`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to upvote post");
        }
      })
      .then((updatedPost) => {
        setUpvotes(updatedPost.upvotes);
      })
      .catch((error) => {
        console.error("Error upvoting post:", error);
      });
  };
  
  

  if (!postInfo) return null;

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>
      <div className="upvote-section">
        <button
          onClick={handleUpvote}
          className="upvote-btn"
          disabled={userInfo.id === postInfo.author._id}
        >
          <FaThumbsUp /> Upvote ({upvotes})
        </button>
      </div>
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link
            className="edit-btn"
            to={`/edit/${postInfo._id}`}
            style={{ textDecoration: "none" }}
          >
            Edit this post
          </Link>
          <button onClick={handleDelete} className="del-btn">
            Delete this post
          </button>
        </div>
      )}
      <div className="image">
        <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
}
