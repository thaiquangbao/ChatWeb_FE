import React, { useRef, useState, useContext, useEffect } from 'react'

import './update.scss'; // Import SCSS file
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../untills/context/AuthContext'


export const Update = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();


    
    const handleBackHome = () => {
        navigate('/page');
    }

    return (
        <div className='update-wrapper'>
            <div className='update-section-one'>

                <div className="title-section-one">
                    <p>Actions</p>
                </div>


                <div className="list-section-one">
                <p className='p-update-information'><Link to={`/update_information/${user._id}`}>Update Information</Link></p>
                    <p className='p-update-password'><Link to={`/update_password/${user._id}`}>Update Password</Link></p>
                    <p className='delete-account'><Link to={`/delete_account/${user._id}`}>❌ DELETE ACCOUNT</Link></p>
                    <p onClick={handleBackHome}>Home</p>
                </div>
            </div>

            <div className='update-section-two'>

            </div>
        </div>


    )
}

