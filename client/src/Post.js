import { useState } from "react";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa";

export default function Post({ _id, title, summary, cover, createdAt, author, upvotes, onUpvote }) {
  const [isUpvoted, setIsUpvoted] = useState(false);

  const handleUpvote = () => {
    if (!isUpvoted) {
      setIsUpvoted(true);
      // Trigger the onUpvote callback to notify the parent component (PostPage)
      onUpvote(_id);
    }
  };

  return (
    <div className="post">
      <div className="im">
        <Link to={`/post/${_id}`}>
        <img className="image" src={`http://localhost:4000/${cover}`} alt={title} />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <span className="author">@{author.username}</span>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
       
        <div className="upvote-section">
          <button className= "votes" onClick={handleUpvote} disabled={isUpvoted}>
            <FaThumbsUp /> Upvote ({upvotes})
          </button>
        </div>
      </div>
    </div>
  );
}
