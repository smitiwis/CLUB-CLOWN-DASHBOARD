import { Spinner } from '@heroui/react'
import React from 'react'

const LoadingComponent = () => {
  return (
     <div className="flex justify-center items-center w-full h-[calc(100vh-118px)]">
      <Spinner size="lg"/>
    </div>
  )
}

export default LoadingComponent