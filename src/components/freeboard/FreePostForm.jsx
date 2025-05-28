// src/components/freeboard/FreePostForm.jsx
import React, { useState } from 'react';
import './FreePostForm.css';

const FreePostForm = ({ onAddPost }) => {
  const [authorName, setAuthorName] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!authorName || !postTitle || !postContent) {
      alert('작성자, 제목, 내용을 모두 입력해주세요.');
      return;
    }

    const newPost = {
      id: Date.now(), // 고유 ID
      authorName,
      title: postTitle,
      content: postContent,
      createdAt: new Date().toISOString(), // 작성 시간
      // 자유 게시판에 필요 없는 필드들은 포함하지 않습니다.
    };

    onAddPost(newPost);

    // 폼 초기화
    setAuthorName('');
    setPostTitle('');
    setPostContent('');
  };

  return (
    <form className="free-post-form" onSubmit={handleSubmit}>
      <h2>새 게시글 작성</h2>
      <div className="form-group">
        <label htmlFor="authorName">작성자 닉네임</label>
        <input
          type="text"
          id="authorName"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="postTitle">제목</label>
        <input
          type="text"
          id="postTitle"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="postContent">내용</label>
        <textarea
          id="postContent"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          rows="5"
          required
        ></textarea>
      </div>
      <button type="submit" className="submit-button">게시글 작성</button>
    </form>
  );
};

export default FreePostForm;