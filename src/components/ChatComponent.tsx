'use client'
import React from 'react'

type Props = {};

const ChatComponent = (props: Props) => {
    return (
        <div className='relative max-h-screen overflow-scroll'>
            <div className='sticky top-0 inset-x-0 p-2 bg-white h-fit'>
                <h3 className='text-xl font-bold' >Chat</h3>
            </div>
        </div>
    )
}

export default ChatComponent
