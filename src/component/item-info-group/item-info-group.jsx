import React from 'react';
import './item-info-group.scss';

const ItemInfoGroup = ({ avatar, name, members }) => {
    return (
        <div className='item-group-wrapper'>
            <div className='item-group-inner'>
                <img className='item-group-avatar' src={avatar} alt="" style={{ width: '50px', borderRadius: "50px" }} />

                <div className='item-group-information'>
                    <p className='item-group-name'>{name}</p>
                    <p className='item-group-members'>{members}</p>
                </div>

            </div>
        </div>
    );
}

export default ItemInfoGroup;
