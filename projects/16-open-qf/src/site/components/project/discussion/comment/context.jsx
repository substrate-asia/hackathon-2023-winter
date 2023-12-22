import React from "react";

const CommentContext = React.createContext();

export default CommentContext;

export const CommentProvider = ({ comment, children }) => {
  return (
    <CommentContext.Provider value={comment}>
      {children}
    </CommentContext.Provider>
  );
};

export const useComment = () => React.useContext(CommentContext);
