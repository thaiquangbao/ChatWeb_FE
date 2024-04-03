import React, { useState, useEffect, useContext } from 'react'
import { forgotAccount, removeToken, removeCookie, getCookieExist } from '../../untills/api'
import { useNavigate } from 'react-router-dom';
import { globalContext } from '../../component/context/globalContext';
import { statusMessage } from '../../component/notification';
import SuccessMicroInteraction from './Success Micro-interaction.gif';
import ErrorMicroInteraction from './giphy.gif';


const Forgot = () => {

    const [isActive, setIsActive] = useState(false); // Cảm giác nút bấm
    const [isLoading, setIsLoading] = useState(false); // modal loading xoay xoay
    const [showSuccessModal, setShowSuccessModal] = useState(false); // modal success tick xanh uy tín
    const [showErrModal, setShowErrModal] = useState(false); // modal err
    const [buttonClicked, setButtonClicked] = useState(false); // State để theo dõi nút đã được click hay chưa






    const [isEmailEmpty, setIsEmailEmpty] = useState(true); // State để theo dõi trạng thái của ô nhập email




    const naviGate = useNavigate();
    const { handler } = useContext(globalContext)
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    useEffect(() => {
        getCookieExist()
            .then((data) => {
                if (data.status === 200) {

                    naviGate("/forgot")
                }
                else {
                    naviGate("/page")
                    handler.setProp({ status: statusMessage.SUCCESS, message: 'Login success' })
                }
            })
            .catch((err) => {
                naviGate("/page")
                handler.setProp({ status: statusMessage.SUCCESS, message: 'Login success' })
            });
    }, [])


    // Khi giá trị của ô nhập email thay đổi, cập nhật state và kiểm tra trạng thái của ô
    useEffect(() => {
        setIsEmailEmpty(email.trim() === ''); // Kiểm tra xem ô nhập email có trống không
    }, [email]);

    const handleInputChange = (event) => {
        const { value } = event.target;
        setEmail(value.trim());
    };


    const handleFormSubmit = (event) => {
        event.preventDefault();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        setButtonClicked(true); // Đặt trạng thái nút đã được click


        if (!emailPattern.test(email)) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
            setIsActive(true); // Kích hoạt hiển thị modal loading
            setIsLoading(true); // Hiển thị modal loading

            // Thực hiện xử lý gửi email hoặc điều hướng tùy ý 
            const data = { email }
            forgotAccount(data)
                .then((res) => {
                    if (res.data === true) {
                        // Ẩn modal loading và hiển thị modal thành công sau 3 giây
                        setTimeout(() => {
                            setIsLoading(false); // Ẩn modal loading
                            setShowSuccessModal(true); // Hiển thị modal thông báo thành công
                        }, 3000);

                        // Sau khi đợi 5 giây, reload trang
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 5000);
                    } else {
                        setIsLoading(false); // Ẩn modal loading
                        setIsActive(false)

                        setShowErrModal(true); // Hiển thị modal lỗi
                    }
                })
                .catch((err) => {
                    setIsLoading(false); // Ẩn modal loading
                    setIsActive(false)


                    setShowErrModal(true); // Hiển thị modal lỗi
                })
        }
    };
    const handleBackHome = () => {
        naviGate('/login')
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ width: '400px', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
            <i className='bx bx-left-arrow-alt' onClick={handleBackHome} style={{ fontSize: '40px', paddingRight: '60px' }}></i>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Forgot Password</h2>

                <input type="email" onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 0', border: '1px solid #ccc', borderRadius: '5px' }}
                    required placeholder='Insert Email' />
                {emailError && <span style={{ color: 'red', marginTop: '5px' }}>{emailError}</span>}
                <input
                    type="submit"
                    value="Submit"
                    // className={buttonClicked ? 'button-active' : ''} // Gán class khi nút đã được click
                    style={{
                        margin: '10px 0',
                        background: 'linear-gradient(150deg, rgb(255, 168, 73), rgb(241, 116, 78), rgb(224, 86, 54), rgb(231, 152, 71), rgb(247, 194, 94))',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 0',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        width: '100%',
                        opacity: isEmailEmpty ? 0.5 : 1, // Điều chỉnh độ mờ của nút dựa trên trạng thái của ô nhập email
                    }}
                    disabled={isEmailEmpty} // Vô hiệu hóa nút khi ô nhập email trống
                    onClick={handleFormSubmit}


                />
                {isActive && (
                    <div className="modal-overlay" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                        <div className="modal" style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '40px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)', animation: 'fadeIn 0.3s forwards', position: 'relative', width: '30%', height: '20%' }}>
                            {isLoading ? (
                                <div className="modal-content" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <p style={{ marginBottom: '40px', fontSize: '20px' }}>Đợi chút nha, sắp xong rồi</p>
                                    <div className="loader" style={{ border: '6px solid #f3f3f3', borderTop: '6px solid #3498db', borderRadius: '50%', width: '60px', height: '60px', animation: 'spin 1s linear infinite' }}></div>
                                </div>
                            ) : showSuccessModal ? (
                                <div className="modal-content" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <p>Mật khẩu mới đã được gửi về mail của bạn</p>
                                    <img src={SuccessMicroInteraction} alt="Success Micro Interaction" style={{ width: '190px', height: '120px' }} />
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                {showErrModal && (
                    <div className="modal-overlay" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                        <div className="modal" style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '40px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)', animation: 'fadeIn 0.3s forwards', position: 'relative', width: '30%', height: '20%' }}>
                            <div className="modal-content" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                               
                                <p style={{ margin: 0, lineHeight: '1.5' }}>Vui lòng nhập chính xác email đăng ký tài khoản của bạn</p>
                                <img src={ErrorMicroInteraction} alt="Success Micro Interaction" style={{ width: '190px', height: '120px' }} />
                               
                                <button style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'red', fontSize: '24px' }} onClick={() => setShowErrModal(false)}>X</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Forgot