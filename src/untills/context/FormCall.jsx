
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../untills/context/AuthContext'
import { SocketContext } from '../../untills/context/SocketContext';

export const callContext = createContext();

const FormCall = ({ children }) => {
    const [videoCallFrom, setVideoCallFrom] = useState(false)
    const dataCall = { videoCallFrom };
    const handlerCall = { setVideoCallFrom };
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [pictureCall, setPictureCall] = useState('');
    const [nameCall, setNameCall] = useState('');
   /*  useEffect(() => {
        socket.on(`userCallVoiceRecipient${user.email}`, (data) => {
            setVideoCallFrom(true)
            // setPictureCall(data.picture)
            // setNameCall(data.name)
        })
        return () => {
            socket.off(`userCallVoiceRecipient${user.email}`)
        }
    },[socket, user.email]) */
    return (
        videoCallFrom && (
        <callContext.Provider value={{ dataCall, handlerCall }}>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: videoCallFrom ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', width: '400px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                    <div className='titleadd' style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px', position: 'relative' }}>
                        <h2 style={{ fontSize: '15px', color: '#333', textAlign: 'center', marginBottom: '10px' }}>Cuộc gọi tới</h2>
                        <i className='bx bx-x' style={{ cursor: 'pointer', fontSize: '25px', position: 'absolute', right: '0', top: '0' }} onClick={() => setVideoCallFrom(false)}></i>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                        <img src={pictureCall} alt="" style={{ width: '75px', height: '75px', borderRadius: '50%', padding: '10px' }} />
                        <div style={{ fontSize: '18px' }}>{nameCall} đang gọi cho bạn</div>
                    </div>



                    <div className='endAdd' style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <i className='bx bxs-phone-call' style={{ backgroundColor: '#45C32C', color: 'white', padding: '12px', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '25px', transition: 'background-color 0.3s' }}></i>
                        <i className='bx bx-x' style={{ backgroundColor: 'red', color: 'white', padding: '12px', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '25px', transition: 'background-color 0.3s' }}></i>

                    </div>
                </div>
            </div>
            {children}
        </callContext.Provider>
        )
    );
};

export default FormCall;
