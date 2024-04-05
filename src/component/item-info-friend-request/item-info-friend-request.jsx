import React from 'react';
import './item-info-friend-request.scss';

const ItemInfoFriendRequest = ({ friendRequest }) => {
    const handleFriendAccept = () => {
        console.log(friendRequest._id)
    }
    return (
        <div className='item-friend-request-wrapper'>
            <div className='item-friend-request-inner'>
                <img className='item-friend-request-avatar' src={friendRequest.avatar} alt="" style={{ width: '100px', borderRadius: "50px" }} />

                <div className='item-friend-request-information'>
                    <p className='item-friend-request-name'>{friendRequest.fullName}</p>
                    <p className='item-friend-request-date'>{friendRequest.phoneNumber}</p>

                    <div className='button-friend-request'>
                        <button className='button-friend-request-1' onClick={handleFriendAccept}>Accept</button>


                    </div>
                </div>



            </div>
        </div>
    );
}

export default ItemInfoFriendRequest;

