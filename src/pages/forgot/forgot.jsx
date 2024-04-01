import React, { useState } from 'react'

const Forgot = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(email)) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
            // Thực hiện xử lý gửi email hoặc điều hướng tùy ý
        }
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ width: '400px', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
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