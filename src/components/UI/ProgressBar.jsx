import React from "react";

export default function ProgressBar({ className = "", width, color }) {
  return (
    <div className={`bg-gray-200 rounded-full ${className}`}>
      <div
        className="h-full rounded-full"
        style={{
          width,
          backgroundColor: color || "#66c888",
        }}
      ></div>
    </div>
  );
}
