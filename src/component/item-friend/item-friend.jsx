import React from 'react';
import './item-friend.scss';

const ItemFriend = ({ icon, content }) => {
    return (
        <div className='item-friend-wrapper'>
            <div className='item-friend-inner'>
                <i id='icon' className={icon}></i>
                <p className='item-friend-content'>{content}</p>
            </div>
        </div>
    );
}

export default ItemFriend;
