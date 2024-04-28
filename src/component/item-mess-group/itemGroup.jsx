import React, { useEffect, useState } from 'react'
import './itemGroup.scss'
const ItemGroup = ({ link, nameGroup, action, time, tt, onClick }) => {
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

    }
    return (
        <button className='item' onClick={onClick} style={{ position: 'relative' }} onMouseEnter={() => mouseEntry(true)} onMouseLeave={() => handleLeave(false)}>
            <div className='item-name'>
                <div style={{ position: 'relative', width: '50px',height:'50px' }}>
                <img src={link} alt="" style={{ width: '100%', height: "100%", borderRadius: '50%' }} />
                </div>

                <div className='name'>
                    <span className='mess-name'>{nameGroup}</span>
                    <span className='mess-infor'>{tt}{action}</span>
                </div>
            </div>
            <span>{mouse ? (<div onClick={handleBtn}>...</div>) : (time)}
            </span>
            {
                btnForm && (
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', right: '0', justifyContent: 'center', zIndex: '50', marginTop: '22px' }}>

                    </div>)
            }
        </button >
    )
}

export default ItemGroup