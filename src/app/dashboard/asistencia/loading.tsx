import { Spinner } from '@nextui-org/react'
import React from 'react'

const Loading = async() => {

return (
     <div className="flex justify-center items-center w-full h-full">
      <Spinner size="lg"/>
    </div>
  )
}

export default Loading