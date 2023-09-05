// CommentComponent.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Button, Input, List, Typography } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import "./CommentComponent.scss";


const CommentComponent = ({ productId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Kết nối với server Socket.io
    const newSocket = io("https://localhost:8001");
    setSocket(newSocket);

    // Lắng nghe sự kiện "newComment" từ server và cập nhật danh sách bình luận
    newSocket.on("newComment", (comment) => {
      setComments((prevComments) => [comment, ...prevComments]);
    });

    // Lắng nghe sự kiện "updateComment" từ server và cập nhật like/dislike
    newSocket.on("updateComment", (comment) => {
      setComments((prevComments) =>
        prevComments.map((c) => (c._id === comment._id ? comment : c))
      );
    });

    // Gửi yêu cầu lấy danh sách bình luận từ server
    axios.get(`${process.env.REACT_APP_API_PORT}/comments/${productId}`).then((response) => {
      setComments(response.data);
    });

    return () => {
      // Ngắt kết nối khi component unmount
      newSocket.disconnect();
    };
  }, [productId]);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    axios.post(`${process.env.REACT_APP_API_PORT}/comments`, { productId, user, content: newComment });
    setNewComment("");
  };

  const handleLikeComment = (commentId) => {
    socket.emit("likeComment", commentId);
  };

  const handleDislikeComment = (commentId) => {
    socket.emit("dislikeComment", commentId);
  };

  return (
    <div className="comment-container">
      <Typography.Title className="comment-title" level={4}>Add Comments</Typography.Title>
      <Input
        className="comment-input"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      
      <Button type="primary" onClick={handleAddComment}>
        Add Comment
      </Button>
      <br/>
      <br/>
      
      <Typography.Title className="comment-title" level={4}>Comments</Typography.Title>
      <List
        className="comment-list"
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item className="comment-item">
            <div>
              <Typography.Text strong>{comment.user}</Typography.Text>
              <Typography.Paragraph>{comment.content}</Typography.Paragraph>
            </div>
            <div className="comment-like-dislike">
              <Button
                icon={<LikeOutlined />}
                onClick={() => handleLikeComment(comment._id)}
              >
                Like
              </Button>
              <span>{comment.likes}</span>
              <Button
                icon={<DislikeOutlined />}
                onClick={() => handleDislikeComment(comment._id)}
              >
                Dislike
              </Button>
              <span>{comment.dislikes}</span>
            </div>
          </List.Item>
        )}
      />
  </div>

  );
};

export default CommentComponent;
