import React, { useContext, useRef, useState } from 'react'
import { logoutUser, removeCookie } from '../../../untills/api';
import { AuthContext } from '../../../untills/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMicroInteraction from './giphy.gif';
import SuccessMicroInteraction from './Success Micro-interaction.gif';
const TaskBar = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const handleCancelLogout = () => {
        setShowLogout(false);
    };
    const handleLogoutClick = () => {
        setShowLogout(true);
    };
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [showLogout, setShowLogout] = useState(false);
    const handleConfirmLogout = () => {
        setIsLoading(true);


        setTimeout(() => {

            logoutUser({})
                .then(res => {
                    removeCookie();

                    setTimeout(() => {
                        navigate("/login");
                    }, 1000);
                })
                .catch(err => {
                    setIsLoading(false);

                    setErrorMessage('Lỗi hệ thống')
                    setShowErrorModal(true)
                });
        }, 1500); // Timeout 2 giây
    };
    const [isActive, setIsActive] = useState(false); // Cảm giác nút bấm
    const [isLoading, setIsLoading] = useState(false); // modal loading xoay
    const [errorMessage, setErrorMessage] = useState('');
    const handleCloseErrorModal = () => {
        setShowErrorModal(false);

    };
    const handleButtonClickTT = () => {
        if (formRefTT.current.style.display === 'none') {

            formRefTT.current.style.display = 'flex';
        } else {

            formRefTT.current.style.display = 'none';
        }
    };
    const formRefTT = useRef(null);
    const [loi, setLoi] = useState(false);
    const ModalError = ({ message, onClose }) => (
        <div className="modal-overlay" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <div className="modal" style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '40px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)', animation: 'fadeIn 0.3s forwards', position: 'relative', width: '30%', height: '20%' }}>
                <div className="modal-content" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p>{message}</p>
                    <img src={loi ? SuccessMicroInteraction : ErrorMicroInteraction} alt="" style={{ width: '190px', height: '120px' }} />
                    {loi === false && <button style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'red', fontSize: '24px' }} onClick={onClose}>X</button>}

                </div>
            </div>
        </div>
    );
    const handleUpdateUser = () => {
        navigate(`/update_information/${user._id}`)
    };
    const handleButtonDeTT = () => {
        formRefTT.current.style.display = 'none';

    };
    return (

        <div className='section-one'>
            {showErrorModal && <ModalError message={errorMessage} onClose={handleCloseErrorModal} />}
            <div className='list-icon'>
                <Link to={'/page'}><i className='bx bx-home'></i></Link>
                <Link to={'/contact'}> <i className='bx bxs-contact' ></i></Link>


                <Link onClick={handleLogoutClick}><i className='bx bx-log-out'></i></Link>


            </div>
            <img className='img-user' onClick={handleButtonClickTT} src={user.avatar} alt="" style={{ borderRadius: "50%", width: '50px', height: '50px' }} />



            {showLogout && (
                <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '10000' }}>
                    <div className="modal-content" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
                        <p>Are you sure you want to sign out?</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button
                                onClick={() => {
                                    setIsActive(true);
                                    handleConfirmLogout();
                                }}
                                style={{
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 30px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease',
                                    // Thay đổi màu nền khi nút được nhấn
                                    backgroundColor: isActive ? '#0056b3' : '#007bff',
                                }}
                            >
                                Yes
                            </button>
                            {isLoading && ( // Hiển thị modal loading khi isLoading = true
                                <div className="modal-overlay" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                                    <div className="modal" style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '40px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)', animation: 'fadeIn 0.3s forwards', position: 'relative', width: '30%', height: '20%' }}>
                                        <div className="modal-content" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <p style={{ marginBottom: '40px', fontSize: '20px' }}>Logging out</p>
                                            <div className="loader" style={{ border: '6px solid #f3f3f3', borderTop: '6px solid #3498db', borderRadius: '50%', width: '60px', height: '60px', animation: 'spin 1s linear infinite' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}





                            <button onClick={handleCancelLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 28px', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>
                </div>
            )
            }

            <div id='myFormTT' ref={formRefTT} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'none', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)', padding: '20px', width: '400px' }}>
                    <h3 style={{ fontSize: '24px', marginBottom: '20px', position: 'relative' }}>
                        Personal Information
                        <button className='btn-off' onClick={handleButtonDeTT} style={{ position: 'absolute', top: '5px', right: '5px', border: 'none', background: 'none', cursor: 'pointer' }}>
                            <i className='bx bx-x' style={{ fontSize: '24px', color: '#333' }}></i>
                        </button>
                    </h3>
                    <img src={user.background} alt="" style={{ width: '400px', height: '140px', borderRadius: '8px', marginBottom: '20px' }} />
                    <div className='image-name' style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <img src={user.avatar} alt="" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #333', marginRight: '20px' }} />
                        <span id='name' style={{ fontSize: '20px', fontWeight: 'bold' }}>{user.fullName}</span>
                    </div>
                    <div className='infor'>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontWeight: 'bold' }}>Gender:</label>
                            <span id='gender' style={{ marginLeft: '10px' }}>{user.gender}</span>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontWeight: 'bold' }}>Date of Birth:</label>
                            <span id='birthday' style={{ marginLeft: '10px' }}>{user.dateOfBirth}</span>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontWeight: 'bold' }}>Email:</label>
                            <span id='email' style={{ marginLeft: '10px' }}>{user.email}</span>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontWeight: 'bold' }}>Phone Number:</label>
                            <span id='phone' style={{ marginLeft: '10px' }}>{user.phoneNumber}</span>
                        </div>
                    </div>
                    <button onClick={handleUpdateUser} className='btn-update-infor' style={{ backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}>Update</button>
                </div>
            </div>
        </div >
    )
}

export default TaskBar