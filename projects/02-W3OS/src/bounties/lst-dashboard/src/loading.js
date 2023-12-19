import React from "react";

const Loading = () => {
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
}

export default Loading;