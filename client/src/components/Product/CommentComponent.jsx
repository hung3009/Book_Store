import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Button, Input, List, Typography, message } from "antd";
import { LikeOutlined, DislikeOutlined, CloseCircleOutlined } from "@ant-design/icons";
import moment from "moment";

import "./CommentComponent.scss";


const CommentComponent = ({ productId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [socket, setSocket] = useState(null);
  const [isInputEmpty, setIsInputEmpty] = useState(true); 
  const [userLikedComments, setUserLikedComments] = useState([]);
  const [userDislikedComments, setUserDislikedComments] = useState([]);

  useEffect(() => {
    // Kết nối với server Socket.io
    const newSocket = io(`${process.env.REACT_APP_API_PORT}`);
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
      console.log(response.data);

      const likedComments = response.data.filter((comment) =>
        comment.likedBy.includes(user)
      );
      const dislikedComments = response.data.filter((comment) =>
        comment.dislikedBy.includes(user)
      );
      setUserLikedComments(likedComments.map((comment) => comment._id));
      setUserDislikedComments(dislikedComments.map((comment) => comment._id));
            
    });

    return () => {
      // Ngắt kết nối khi component unmount
      newSocket.disconnect();
    };


  }, [productId,user]);

  const handleClearInput = () => {
    setNewComment(""); 
    setIsInputEmpty(true); 
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    axios.post(`${process.env.REACT_APP_API_PORT}/comments`, { productId, user, content: newComment });
    message.success("Add comment success");
    setTimeout(() => {
      window.location.reload();
    }, 2000);

    setNewComment("");
  };


  const handleLikeComment = (commentId) => {
    if (!userLikedComments.includes(commentId)) {
       // Gửi yêu cầu "like" đến server
      socket.emit("likeComment", commentId, user);


      const comment = comments.find((c) => c._id === commentId);

      if (comment && comment.likedBy.some((likedUser) => likedUser === user)) {
        return;
      }


       // Cập nhật trạng thái "liked" trong state và localStorage
       const updatedLikedComments = [...userLikedComments, commentId];
       setUserLikedComments(updatedLikedComments);
     
    }
  };
  
  const handleDislikeComment = (commentId) => {
    if (!userDislikedComments.includes(commentId)) {
      // Gửi yêu cầu "dislike" đến server
      socket.emit("dislikeComment", commentId, user);



      const comment = comments.find((c) => c._id === commentId);

      if (comment && comment.dislikedBy.some((dislikedUser) => dislikedUser === user)) {
       
        return;
      }

      // Cập nhật trạng thái "disliked" trong state và localStorage
      const updatedDislikedComments = [...userDislikedComments, commentId];
      setUserDislikedComments(updatedDislikedComments);
      
    }
  };

  return (
    <div className="comment-container">
      <Typography.Title className="comment-title" level={4}>Add Comments</Typography.Title>
      <Input.TextArea
        className="comment-input"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => {
          setNewComment(e.target.value);
          setIsInputEmpty(e.target.value === ""); 
        }}
        autoSize={{ minRows: 4, maxRows: 10 }}
      />
      {isInputEmpty ? null : (
        <Button
          type="text"
          className="clear-comment-button"
          onClick={handleClearInput}
          icon={<CloseCircleOutlined />} // Thay đổi biểu tượng theo ý muốn của bạn
        />
      )}
      <Button type="primary" className="add-comment-button" onClick={handleAddComment}>
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
            <Typography.Text className="comment-user" strong>{comment.user}</Typography.Text>
            <Typography.Paragraph className="comment-content" >{comment.content}</Typography.Paragraph>
            <div className="comment-like-dislike">
              <Button
                icon={
                  <LikeOutlined
                    style={{
                      color: userLikedComments.includes(comment._id) ? "green" : "black",
                    }}
                  />
                }
                onClick={() => handleLikeComment(comment._id)}
              >
                Like
              </Button>
              <span>{comment.likes}</span>
              <Button
                icon={
                  <DislikeOutlined
                    style={{
                      color: userDislikedComments.includes(comment._id) ? "red" : "black",
                    }}
                  />
                }
                onClick={() => handleDislikeComment(comment._id)}
              >
                Dislike
              </Button>
              <span>{comment.dislikes}</span>
            </div>
            <div className="comment-timestamp">
              {moment(comment.createdAt).fromNow()} 
            </div>
          </List.Item>  
        )}
      />
    </div>

  );
};

export default CommentComponent;
