import React from 'react'
import StatServer from './aiusagestats/StatsServer'
import Loading from './aiusagestats/Loading'

import { Suspense } from 'react'
const page = () => {
  return (
    <div>

        <Suspense fallback = {<Loading/>}>
        <StatServer/>
        </Suspense>


      
    </div>
  )
}

export default page
