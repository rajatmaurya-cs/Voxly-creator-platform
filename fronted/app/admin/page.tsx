import React from 'react'
import { Suspense } from 'react'

import StatusServer from './dashboard/status/StatusServer'
import BlogServer from './dashboard/blog/BlogServer'
import { StatusSkeleton, BlogListSkeleton } from './dashboard/loading'


const Page = () => {
  return (
    <div className="space-y-6">

       <Suspense fallback={<StatusSkeleton />}>
        <StatusServer />
      </Suspense>

       <Suspense fallback={<BlogListSkeleton />}>
         <BlogServer />
       </Suspense>

     
    </div>
  )
}

export default Page
