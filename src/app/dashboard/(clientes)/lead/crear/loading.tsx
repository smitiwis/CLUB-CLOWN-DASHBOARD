import { Spinner } from '@nextui-org/react'
import React from 'react'

const Loading = () => {
  return (
    <>
      <h1>Carngando ....</h1>
       <div className="flex justify-center items-center w-full h-full">
      <Spinner size="lg"/>
    </div>
    </>
  )
}

export default Loading