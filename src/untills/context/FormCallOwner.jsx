
import React, { createContext, useState } from 'react';


export const callContext = createContext();

const FormCallOwner = ({ children }) => {
    const [videoCallFrom, setVideoCallFrom] = useState(false)
    const dataCall = { videoCallFrom };
    const handlerCall = { setVideoCallFrom };
    const [pictureCall, setPictureCall] = useState('');
    const [nameCall, setNameCall] = useState('');
    const handleCancelCall = () => {

    }
    return (
        <callContext.Provider value={{ dataCall, handlerCall }}>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', width: '400px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                        <div className='titleadd' style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px', position: 'relative' }}>
                            <h2 style={{ fontSize: '15px', color: '#333', textAlign: 'center', marginBottom: '10px' }}>Đang gọi</h2>
                            <i className='bx bx-x' style={{ cursor: 'pointer', fontSize: '25px', position: 'absolute', right: '0', top: '0' }} /* onClick={() => setVideoCall(false)} */></i>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                            <img src={pictureCall} alt="" style={{ width: '75px', height: '75px', borderRadius: '50%', margin: '10px' }} />
                            <div style={{ fontSize: '18px' }}>Đang gọi cho {nameCall}</div>
                        </div>



                        <div className='endAdd' style={{ display: 'flex', justifyContent: 'space-around' }}>

                            <i className='bx bxs-phone-incoming' onClick={handleCancelCall} style={{ backgroundColor: 'red', color: 'white', padding: '12px', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '25px', transition: 'background-color 0.3s' }}></i>

                        </div>
                    </div>
                </div>
            {children}
        </callContext.Provider>
    );
};

export default FormCallOwner;
