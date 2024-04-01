import React, { useRef, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../untills/context/AuthContext';
import SuccessMicroInteraction from './Success Micro-interaction.gif';
import { updatePassword, removeCookie, logoutUser } from '../../untills/api'


export const UpdatePassword = () => {

    const [isActive, setIsActive] = useState(false); // Cảm giác nút bấm
    const [isLoading, setIsLoading] = useState(false); // modal loading xoay xoay
    const [showSuccessModal, setShowSuccessModal] = useState(false); // modal success tick xanh uy tín


    const { user } = useContext(AuthContext);

    const navigate = useNavigate();
    const handleBackHome = () => {
        navigate('/page');
    }

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [oldPassword, setOldPassword] = useState('');
    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);

    };
    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value)
    }
    const btnChangePass = () => {

        setIsActive(true); // Kích hoạt hiệu ứng khi nút được click
        setIsLoading(true); // Hiển thị modal loadin


        if (!confirmPassword || !oldPassword || !newPassword) {
            alert("Hãy điền đầy đủ dữ liệu")
        }
        if (confirmPassword === newPassword) {
            const data = {
                oldPassWord: oldPassword,
                passWord: confirmPassword,
            }
            setPasswordsMatch(true);
            updatePassword(user._id, data)
                .then((res) => {
                    if (res.data.message === "PassWord is not defined") {
                        alert("Mật khẩu cũ không đúng")
                    } else {
                        setTimeout(() => {
                            setIsLoading(false); // Ẩn modal loading
                            setShowSuccessModal(true); // Hiển thị modal thông báo thành công

                            // Sau khi đợi 3 giây, reload trang
                            setTimeout(() => {

                                setTimeout(() => {
                                    logoutUser({})
                                        .then(res => {
                                            removeCookie();
                                            setTimeout(() => {
                                                navigate("/login");
                                            }, 1000);
                                        })
                                        .catch(err => {
                                            alert("Lỗi hệ thống")
                                        });
                                }, 1000);
                            }, 2000);
                        }, 1000);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            setPasswordsMatch(false);
            alert('new password và confirm password không trùng nhau')
        }
    };
    return (
        <div className='update-wrapper'>
            <div className='update-section-one'>
                <div className="title-section-one">
                    <i className='bx bx-left-arrow-alt' onClick={handleBackHome} style={{ fontSize: '40px', paddingRight: '60px' }}></i>
                    <h2 style={{ paddingRight: '100px' }}>Action</h2>
                </div>
                <div className="list-section-one">
                    <Link to={`/update_information/${user._id}`}><p className='p-update-information' style={{ color: 'black' }}>Update Information</p></Link>
                    <Link to={`/update_password/${user._id}`}><p className='p-update-password' style={{ color: 'orange' }}>Update Password</p></Link>
                    <Link to={`/delete_account/${user._id}`}><p className='delete-account'>❌ DELETE ACCOUNT</p></Link>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '150vh' }}>
                <div style={{ border: '1px solid black', padding: '50px', borderRadius: '5px' }}>
                    <h1 style={{ color: 'orange', animation: 'bouncel 2s' }}>UPDATE PASSWORD</h1>
                    <form>
                        <p >Old Password</p>
                        <input type="password" value={oldPassword} onChange={handleOldPasswordChange} style={{ width: '400px', padding: '10px 0', borderRadius: '5px', animation: 'bouncel 0.5s' }} />
                        <p>New Password</p>
                        <input type="password" value={newPassword} onChange={handleNewPasswordChange} style={{ width: '400px', padding: '10px 0', borderRadius: '5px', animation: 'bouncel 1s' }} />
                        <p>Confirm New Password</p>
                        <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} style={{ width: '400px', padding: '10px 0', borderRadius: '5px', animation: 'bouncel 1.5s' }} />
                        {!passwordsMatch && <p>Passwords do not match</p>}
                    </form>

                    <button
                        onClick={btnChangePass}
                        style={{
                            background: isActive ? 'rgb(200, 100, 50)' : 'linear-gradient(150deg, rgb(255, 168, 73), rgb(241, 116, 78), rgb(224, 86, 54), rgb(231, 152, 71), rgb(247, 194, 94))',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            width: '100%',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            margin: '0',
                            padding: '10px 20px',
                            marginTop: '20px',
                            transition: 'background-color 0.3s ease',
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        Update
                    </button>
                </div>
            </div>

            {isActive && (
                <div className="modal-overlay" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div className="modal" style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '40px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)', animation: 'fadeIn 0.3s forwards', position: 'relative', width: '25%', height: '15%' }}>
                        {isLoading ? (
                            <div className="modal-content" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <p style={{ marginBottom: '40px', fontSize: '20px' }}>Đợi chút nha, sắp xong rồi</p>
                                <div className="loader" style={{ border: '6px solid #f3f3f3', borderTop: '6px solid #3498db', borderRadius: '50%', width: '60px', height: '60px', animation: 'spin 1s linear infinite' }}></div>
                            </div>
                        ) : showSuccessModal ? (
                            <div className="modal-content" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <p>Cập nhật Password của {user.fullName} thành công!</p>
                                <img src={SuccessMicroInteraction} alt="Success Micro Interaction" style={{ width: '190px', height: '120px' }} />
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UpdatePassword;
