import React from "react";

export default function ProgressBar({className="" , width}) {
  return (
    <div className={` bg-gray-200 rounded-full h-1.5 ${className}`}>
      <div
        className={`bg-[#66c888] h-1.5 rounded-full ${className}`}
        style={{
          width: `${width}`,
        }}
      ></div>
    </div>
  );
}
