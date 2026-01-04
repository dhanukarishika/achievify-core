import React from "react";
import Background from "./Background";

const BackgroundCanvas: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      <Background />
    </div>
  );
};

export default BackgroundCanvas;
