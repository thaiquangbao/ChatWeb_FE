import React, { useRef, useState, useContext } from 'react';
import './update_information.scss'; // Import SCSS file
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../untills/context/AuthContext';

export const UpdateInformation = () => {
    const { user } = useContext(AuthContext);
    const [avatar, setAvatar] = useState(user.avatar);
    const [name, setName] = useState(user.fullName);
    const [gender, setGender] = useState(user.gender);
    const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth);
    const navigate = useNavigate();


    
    const handleBackHome = () => {
        navigate('/page');
    }

    const fileInputRef = useRef(null);

    const handleEditAvatar = () => {
        fileInputRef.current.click();
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);
    };

    const handleGenderChange = (e) => {
        const newGender = e.target.value;
        setGender(newGender);
    };

    const handleDateOfBirthChange = (e) => {
        const newDateOfBirth = e.target.value;
        setDateOfBirth(newDateOfBirth);
    };

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
                <div className="title-update-information">
                    <p>UPDATE INFORMATION</p>
                </div>
                <div className='form-update-information'>
                    <form>
                        <div className="update-image">
                            <div className="form-avatar-wrapper">
                                <p>Avatar</p>
                                <div className='form-avatar'>
                                    <img src={avatar} alt="" />
                                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileInputChange} />
                                    <button className='button-edit-image' type="button" onClick={handleEditAvatar}>
                                        <i className='bx bx-edit-alt'></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="form-name">
                            <p>Name</p>
                            <input type="text" value={name} onChange={handleNameChange} />
                        </div>
                        <div className="form-gender">
                            <p>Gender</p>
                            <select value={gender} onChange={handleGenderChange}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="form-email">
                            <p>Email</p>
                            <div>{user.email}</div>
                        </div>
                        <div className="form-dob">
                            <p>Date of Birth</p>
                            <input type="date" value={dateOfBirth} onChange={handleDateOfBirthChange} />
                        </div>
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdateInformation;
