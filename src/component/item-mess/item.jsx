// import React from 'react'
// import './item.scss'
// const Item = ({ link, name, action, time, tt, onClick }) => {
//     return (
//         <button className='item' onClick={onClick}>
//             <div className='item-name'>
//                 <img src={link} alt="" style={{ width: '50px', borderRadius: "50px" }} />
//                 <div className='name'>
//                     <span className='mess-name'>{name}</span>
//                     <span className='mess-infor'>{tt}{action}</span>
//                 </div>
//             </div>
//             <span>{time}</span>

//         </button>

//     )
// }

// export default Item
import React, { useState } from 'react'
import './item.scss'
const Item = ({ link, name, action, time, tt, delele, onClick }) => {
    const [mouse, setMouse] = useState(false)
    const [btnForm, setBtnForm] = useState(false)
    const handleLeave = (mm) => {
        setMouse(false)
        setBtnForm(false)
    }
    const mouseEntry = (mm) => {
        setMouse(mm)
     
    }
    const handleBtn = () => {
        setBtnForm(true)
        // setTimeout(() => {
        //     setBtnForm(false)
        // }, 4000);
    }
    const handleDelete = () => {
        console.log(delele)
    }
    return (
        <button className='item' onClick={onClick} style={{ position: 'relative' }} onMouseEnter={() => mouseEntry(true)} onMouseLeave={() => handleLeave(false)}>
            <div className='item-name'>
                <img src={link} alt="" style={{ width: '50px', borderRadius: "50px" }} />
                <div className='name'>
                    <span className='mess-name'>{name}</span>
                    <span className='mess-infor'>{tt}{action}</span>
                </div>
            </div>
            <span>{mouse ? (<div onClick={handleBtn}>...</div>) : (time)}
            </span>
            {btnForm && (
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', right: '0', justifyContent: 'center', zIndex: '50', marginTop: '22px' }}>
                    <div style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 20px',
                        marginBottom: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }} onClick={handleDelete} >Delete</div>
                    <div style={{
                        backgroundColor: 'red',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 20px',
                        marginBottom: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}> Unfriend</div>
                </div>)}
        </button>

    )
}

export default Item