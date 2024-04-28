import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import "../App.css";
import { FaThumbsUp } from "react-icons/fa";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    // Fetch post data and comments based on ID from URL
    fetch(`http://localhost:4000/post/${id}`)
      .then((response) => response.json())
      .then((postInfo) => {
        setPostInfo(postInfo);
        setUpvotes(postInfo.upvotes || 0);
        setComments(postInfo.comments || []);
        if (postInfo.upvoters && postInfo.upvoters.includes(userInfo.id)) {
          setUpvoted(true);
        }

      })
      .catch((err) => console.error("Error fetching post:", err));
  }, [id, userInfo.id]);

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

  const handleUpvote = async () => {
    try {
      const response = await fetch(`http://localhost:4000/post/${id}/upvote`, {
        method: "POST",
        credentials: "include",
      });
  
      if (response.ok) {
        // Toggle upvoted state and update upvotes count
        setUpvoted(true);
        setUpvotes((prevUpvotes) => prevUpvotes + 1);
      } else {
        throw new Error("Failed to upvote post");
      }
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };


  const handleSubmitComment = async () => {
    try {
      const response = await fetch(`http://localhost:4000/post/${id}/comments`, { // Update the endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content: comment }),
      });
      if (response.ok) {
        const newComment = await response.json();
        setComments([...comments, newComment]);
        setComment("");
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  
  if (!postInfo) return null;

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>
      <div className="upvote-section">
        <button
          className="upvote-btn"
          onClick={handleUpvote}
          disabled={upvoted || userInfo.id === postInfo.author._id}
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
      <div className="img">
        <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
      <div className="comments">
        <h2>Comments</h2>
        {comments.map((comment) => (
  <div key={comment._id} className="comment">
    <p>{comment.content}</p>
    {comment.author && (
      <p>Posted by: {comment.author}</p>
    )}
    {comment.createdAt && (
      <p>Posted at: {formatISO9075(new Date(comment.createdAt))}</p>
    )}
  </div>
))}

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button onClick={handleSubmitComment}>Submit</button>
      </div>
    </div>
  );
}
