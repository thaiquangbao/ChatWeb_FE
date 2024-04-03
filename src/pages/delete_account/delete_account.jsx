
import './delete_account.scss'; // Import SCSS file
import React, { useRef, useState, useContext, useEffect } from 'react'
import { deleteAccount,logoutUser, removeCookie } from '../../untills/api'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../untills/context/AuthContext'

export const DeleteAccount = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    

    const handleBackHome = () => {
        
        deleteAccount(user._id)
        .then((res) => {
            if(res.data === true){
                alert("Xóa tài khoản thành account")
                window.location.href = '/login';   
            } else {
                alert("Xóa tài khoản không thành công")
            }
        })
        .catch((err) => {
            alert("Lỗi Server")
        })
        // navigate('/page');
    }
    const handleBackDelete = () => {
        navigate(`/update_information/${user._id}`)
    }
    const handleBack = () => {
        navigate('/page')
    }
    return (
        <div className='update-wrapper'>
            <div className='update-section-one'>
                <div className="title-section-one" >
                    <i onClick={handleBack} className='bx bx-left-arrow-alt' style={{ fontSize: '40px', paddingRight: '60px' }}></i>
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
                        <button onClick={handleBackHome} style={{ width: '100px', padding: '10px 0', borderRadius: '10px', background: 'red' }}>Yes</button>
                        <button onClick={handleBackDelete} style={{ width: '100px', padding: '10px 0', borderRadius: '10px' }}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>


    )
}

