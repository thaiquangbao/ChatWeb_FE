import React, { useState } from 'react'
import { forgotAccount } from '../../untills/api'
import { Link, useNavigate } from 'react-router-dom';
const Forgot = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const navigate = useNavigate();
    const handleFormSubmit = (event) => {
        event.preventDefault();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(email)) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
            // Thực hiện xử lý gửi email hoặc điều hướng tùy ý
            const data = {
                email: email
            }
            forgotAccount(data)
            .then((res) => {
                if (res.data.status === 404) {
                    alert("User không tồn tại")
                } else if(res.data === true) {
                    alert("Mời bạn vào hộp thư email để xem mật khẩu mới");
                    navigate('/login');
                } else {
                    alert("Lỗi gửi mail")
                }

            })
            .catch((err) => {
                alert("Lỗi Server")
            })
        }
    };
    const handleBack = () => {
        navigate('/login');
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ width: '400px', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
                <i onClick={handleBack} className='bx bx-left-arrow-alt' style={{ fontSize: '40px', paddingRight: '60px' }}></i>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Forgot Password</h2>

                <input type="email" onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 0', border: '1px solid #ccc', borderRadius: '5px' }}
                    required placeholder='Insert Email' />
                {emailError && <span style={{ color: 'red', marginTop: '5px' }}>{emailError}</span>}
                <input type="submit" value="Submit" style={{ margin: '10px 0', backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 0', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s', width: '100%' }} onClick={handleFormSubmit} />

            </div>
        </div>
    )
}

export default Forgot