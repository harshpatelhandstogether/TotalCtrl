import React from "react";

export default function ProgressBar({ className = "", width, color }) {
  const normalizedWidth = typeof width === "number" ? `${width}%` : width;

  return (
    <div className={`bg-gray-200 rounded-full ${className}`}>
      <div
        className="h-full rounded-full"
        style={{
          width: normalizedWidth,
          backgroundColor: color || "#66c888",
        }}
      ></div>
    </div>
  );
}
