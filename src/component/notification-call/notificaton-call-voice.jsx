import React from 'react'

export const NotificationCallVoice = ({ pictureCall, fullName }) => { 
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <img src={pictureCall} alt="" style={{ width: '75px', height: '75px', borderRadius: '50%', padding: '10px' }} />
            <div style={{ fontSize: '18px' }}>{fullName} đang gọi cho bạn</div>
        </div> 
    )
}