import React, { useRef, useState, useContext } from 'react';
import './update_password.scss'; // Import SCSS file
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../untills/context/AuthContext';

export const UpdatePassword = () => {
    const { user } = useContext(AuthContext);
    const fileInputRef = useRef(null);

    const handleEditAvatar = () => {
        // Mở hộp thoại chọn tập tin khi nút được click
        fileInputRef.current.click();
    };

    const handleFileInputChange = (e) => {
        // Xử lý khi người dùng chọn tập tin
        const file = e.target.files[0];
        // Xử lý tập tin ở đây (ví dụ: upload lên server)
    };
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
                <div className="title-update-password">
                    <p>UPDATE PASSWORD</p>
                </div>
                <div className='form-update-password'>
                    <form>
                        <div className="form-name">
                            <p>Old Password</p>
                            <div className="editable">
                                <input type="password" />
                            </div>
                        </div>
                        <div className="form-name">
                            <p>New Password</p>
                            <div className="editable">
                                <input type="password" />
                            </div>
                        </div>
                        <div className="form-name">
                            <p>Confirm New Password</p>
                            <div className="editable">
                                <input type="password" />
                            </div>
                        </div>
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdatePassword;
