'use client';  // Add this line

import React from 'react'
import Link from 'next/link'

export const Footer: React.FC = () => {
  return (
    <footer className="py-10 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800">
      <div className="container">
        <p className="text-center text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
