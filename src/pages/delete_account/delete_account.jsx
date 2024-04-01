
import './delete_account.scss'; // Import SCSS file


import React, { useRef, useState, useContext, useEffect } from 'react'


import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../untills/context/AuthContext'

export const DeleteAccount = () => {
    const navigate = useNavigate();



    const handleBackHome = () => {
        navigate('/page');
    }
    const { user } = useContext(AuthContext);
    return (
        <div className='update-wrapper'>
            <div className='update-section-one'>
                <div className="title-section-one" >
                    <i className='bx bx-left-arrow-alt' onClick={handleBackHome} style={{ fontSize: '40px', paddingRight: '60px' }}></i>
                    <h2 style={{ paddingRight: '100px' }}>Action</h2>
                </div>
                <div className="list-section-one">
                    <p className='p-update-information'><Link to={`/update_information/${user._id}`}>Update Information</Link></p>
                    <p className='p-update-password'><Link to={`/update_password/${user._id}`}>Update Password</Link></p>
                    <p className='delete-account'><Link to={`/delete_account/${user._id}`}>❌ DELETE ACCOUNT</Link></p>


                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ border: '1px solid black', padding: '50px', borderRadius: '5px', position: 'fixed', top: '50%', left: '60%', transform: 'translate(-50%, -50%)' }} >
                    <p >Are you sure you want to delete your account? </p>
                    <p >Your account cannot be recovered after deletion. </p>


                    <div className="buttons" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button style={{ width: '100px', padding: '10px 0', borderRadius: '10px', background: 'red' }}>Yes</button>
                        <button style={{ width: '100px', padding: '10px 0', borderRadius: '10px' }}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>


    )
}

