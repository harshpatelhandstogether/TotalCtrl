import React, { Children } from 'react'

export default function Header({ children, title, className = "" }) {
  return (
    <div className={`px-8  border-b-1 border-gray-200 `}>
      <nav className="bg-white h-20 flex justify-between  pl-4 ">
        <div className="flex items-center gap-4   ">
          <h1 className={`font-source text-black  font-semibold ${className}`}>
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4 pr-2 ">
            {children}
        </div>
      </nav>
    </div>
  )
}
