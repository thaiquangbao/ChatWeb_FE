import React, { useRef, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../untills/context/AuthContext';
import { updatePassword, removeCookie, logoutUser } from '../../untills/api'
export const UpdatePassword = () => {
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
                    alert("Cập nhật PassWord thành công")
                    logoutUser({})
                    .then(res => {
                        removeCookie()
                        setTimeout(() => {
                            navigate("/login");
                        }, 1000);

                    })
                    .catch(err => {
                        alert("Lỗi hệ thống")
                    })
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


            <div style={{ display: 'flex' }}>

                <div style={{ border: '1px solid black', padding: '50px', borderRadius: '5px', position: 'fixed', top: '50%', left: '60%', transform: 'translate(-50%, -50%)' }} >

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
                    <button type="button" onClick={btnChangePass} style={{ background: 'linear-gradient(150deg,rgb(193, 178, 69), rgb(221, 154, 118), orange)', color: '#fff', border: 'none', borderRadius: '5px', width: '100%', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', margin: '0', padding: '10px 20px', marginTop: '20px', animation: 'bouncel 2s' }}>Update</button>
                </div>
            </div>
        </div >
    )
}

export default UpdatePassword;
