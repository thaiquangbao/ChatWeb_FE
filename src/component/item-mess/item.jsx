import React from 'react'
import './item.scss'
const Item = ({ link, name, action, time, tt, onClick }) => {
    return (
        <button className='item' onClick={onClick}>
            <div className='item-name'>
                <img src={link} alt="" style={{ width: '50px', borderRadius: "50px" }} />
                <div className='name'>
                    <span className='mess-name'>{name}</span>
                    <span className='mess-infor'>{tt}:{action}</span>
                </div>
            </div>
            <span>{time}</span>

        </button>

    )
}

export default Item