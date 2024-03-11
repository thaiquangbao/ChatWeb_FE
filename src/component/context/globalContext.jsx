import React, { createContext, useEffect, useState } from 'react'
import Notification, { statusMessage } from '../notification'

export const globalContext = createContext()

const GlobalContext = ({ children }) => {

    const [prop, setProp] = useState({
        status: statusMessage.NONE,
        message: ''
    })

    const data = {
        prop
    }

    const handler = {
        setProp
    }

    useEffect(() => {
        setTimeout(() => {
            setProp({ status: statusMessage.NONE, message: '' })
        }, 3000);
    }, [prop.status])

    return (
        <globalContext.Provider value={{ data, handler }}>
            <Notification status={prop.status} message={prop.message} />
            {children}
        </globalContext.Provider>
    )
}

export default GlobalContext