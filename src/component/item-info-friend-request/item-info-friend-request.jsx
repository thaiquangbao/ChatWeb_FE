import React from 'react';
import './item-info-friend-request.scss';

const ItemInfoFriendRequest = ({ avatar, name, date, button1, button2 }) => {
    return (
        <div className='item-friend-request-wrapper'>
            <div className='item-friend-request-inner'>
                <img className='item-friend-request-avatar' src={avatar} alt="" style={{ width: '100px', borderRadius: "50px" }} />

                <div className='item-friend-request-information'>
                    <p className='item-friend-request-name'>{name}</p>
                    <p className='item-friend-request-date'>{date}</p>

                    <div className='button-friend-request'>
                        <button className='button-friend-request-1'>{button1}</button>
                        <button className='button-friend-request-2'>{button2}</button>

                    </div>
                </div>



            </div>
        </div>
    );
}

export default ItemInfoFriendRequest;
