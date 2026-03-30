import React from 'react';
import './Loading.css';

const Loading: React.FC = () => {
  return (
    <div className="loading-wrapper">
      <div className="dot-container">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loading;