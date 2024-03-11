import React, { useState } from 'react'
import './notification.scss'
import { useEffect } from 'react'

export const statusMessage = {
    SUCCESS: 'a',
    FAIL: 'b',
    NONE: 'c'
}

const Notification = ({ status, message }) => {

    const [prop, setProp] = useState({
        status: statusMessage.NONE,
        message: ''
    })

    useEffect(() => setProp({ status, message }), [status, message])

    return (
        <div style={{
            right: prop.status !== statusMessage.NONE ? '8px' : '-500px',
            backgroundColor: prop.status === statusMessage.FAIL ? 'red' : 'green'
        }} className='notification'>
            <span className='title'>{prop.status === statusMessage.FAIL ? 'Failed' : statusMessage.SUCCESS ? 'Successfully' : ''}</span>
            <span className='message'>{prop.message}</span>
        </div >
    )
}

export default Notification