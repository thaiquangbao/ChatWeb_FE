import React from 'react';
import './item-info-friend.scss';

const ItemInfoFriend = ({ avatar, name }) => {
    return (
        <div className='item-friend-wrapper'>
            <div className='item-friend-inner'>
                <img className='item-friend-avatar' src={avatar} alt="" style={{ width: '50px', borderRadius: "50px" }} />
                <p className='item-friend-name'>{name}</p>
            </div>
        </div>
    );
}

export default ItemInfoFriend;
