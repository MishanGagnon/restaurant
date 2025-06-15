'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import logo from './selectarant-transparent.png'
import Image from 'next/image'

const Page = () => {
  const router = useRouter();

  const goJoin = () => {
    router.push('/lobby')
  }

  const goHost = () => {
    router.push('/host')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
            {/* Logo and Title Section */}
            <div className="flex flex-col items-center mb-12">
              <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
                <Image 
                  src={logo} 
                  alt="Selectaraunt Logo" 
                  width={160} 
                  height={160} 
                  className="object-contain rounded-lg animate-rotate-left-right" 
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight text-center">
                Selectaraunt
              </h1>
              <p className="mt-4 text-lg text-gray-600 text-center">
                Choose your next dining destination together
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                onClick={goJoin}
                className="w-full py-4 px-6 bg-blue-500 text-white rounded-xl text-xl font-semibold hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Join a Session
              </button>
              <button 
                onClick={goHost}
                className="w-full py-4 px-6 bg-blue-500 text-white rounded-xl text-xl font-semibold hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Host a Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
