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
    <div className="flex flex-col items-center justify-center h-svh bg-gray-100 p-6">
      <div className="mb-8">
        <Image src={logo} alt="Selectaraunt Logo" width={128} height={128} className="object-contain rounded-lg animate-rotate-left-right	" />
      </div>

      <div id="page-title" className="text-4xl text-black md:text-5xl font-bold mb-8 tracking-tight">
        Selectaraunt
      </div>
      <div className="flex flex-col gap-4">
        <button className='text-white bg-sky-500 duration-300 hover:bg-sky-400 rounded-xl px-10 py-4 text-xl font-semibold shadow-md hover:shadow-lg' onClick={goJoin}>
          Join a Session
        </button>
        <button className='text-white bg-sky-500 duration-300 hover:bg-sky-400 rounded-xl px-10 py-4 text-xl font-semibold shadow-md hover:shadow-lg' onClick={goHost} >
          Host a Session
        </button>
      </div>
    </div>
  )
}

export default Page
