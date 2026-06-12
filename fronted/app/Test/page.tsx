'use client'
import React from 'react'
import EditorLoader from '../Animations/EditorLoader'
import NetBankingLogo from '@/app/Animations/PriceCards'

const page = () => {
  return (
    <div className='min-h-screen min-w-full flex justify-center items-center bg-white'>
      <EditorLoader/>
      <NetBankingLogo/>
    </div>
  )
}

export default page
