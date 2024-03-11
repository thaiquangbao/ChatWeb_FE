import React, { useState, useRef, useContext, useEffect } from 'react';
import verifiedImage from './verified.gif'; // Import image
import './OTPConfirmationForm.scss'; // Import SCSS file
import { useNavigate } from 'react-router-dom';
import { Auth } from '../../untills/context/SignupContext';
import { postEmail, postValidRegister, removeCookie } from '../../untills/api';

export const OTPConfirmationForm = () => {
    const [isCorrectOTP, setIsCorrectOTP] = useState(false);
    const [otpValues, setOTPValues] = useState(['', '', '', '', '', '']);
    const navigate = useNavigate();
    const [focusedIndex, setFocusedIndex] = useState(-1); // Index của ô được focus
    const [errorMessage, setErrorMessage] = useState(null); // Thông báo lỗi
    const [showSubmitButton, setShowSubmitButton] = useState(false); // State để điều khiển việc hiển thị nút "Submit"
    const [showError, setShowError] = useState(false); // State để điều khiển việc hiển thị thông báo lỗi
    const inputRefs = useRef([]);
    const { data } = useContext(Auth);
    const [announcement, setAnnouncement] = useState('TuanAnh');
    const announcements = useRef([]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = data.auth
        if (token && user) {

            navigate('/vertify');
        }
        else {
            navigate('/signup');
        }

    }, [localStorage.getItem('token'), data.auth])
    useEffect(() => {
        if (showError) {
            const timeout = setTimeout(() => {
                setShowError(false);
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [showError]);
    const handleInputChange = (index, value) => {
        // Kiểm tra xem giá trị mới là một số hay không
        if (!isNaN(value) && value !== '') {
            const newOTPValues = [...otpValues];
            newOTPValues[index] = value;
            setOTPValues(newOTPValues);

            // Tự động chuyển focus sang ô tiếp theo sau khi nhập một số
            if (index < otpValues.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };
    // const handleInputChange = async (e) => {
    //     e.preventDefault();
    //     const validCode = data.auth;
    //     validCode.code = "772P2H"
    //     await postValidRegister(validCode)
    //     .then(res => {
    //        navigate('/login')
    //     })
    //     .catch(err =>{
    //         console.log(err);
    //     })
    // };
    const handleBackspace = (event, index) => {
        if (event.key === 'Backspace' && index >= 0 && index < otpValues.length) {
            const newOTPValues = [...otpValues];
            newOTPValues[index] = '';
            setOTPValues(newOTPValues);

            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handleFocus = (index) => {
        setFocusedIndex(index);
    };

    const handleBlur = () => {
        setFocusedIndex(-1);
    };
    const thongbao = useRef(null);
    const thongbaoEr = useRef(null);
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (otpValues.every(val => val !== '' && !isNaN(val))) {
            const validCode = data.auth;
            validCode.code = otpValues.join("");

            await postValidRegister(validCode)
                .then(res => {
                    if (res.status === 200) {
                        removeCookie()

                        thongbao.current.style.top = "-60px";
                        setTimeout(() => navigate('/login'), 4000);
                    }
                    else {
                        navigate("/signup")
                    }

                })
                .catch(err => {
                    // alert("Mã không đúng"); // mã không thành công
                    setShowError(false)
                    thongbaoEr.current.style.display = "block";
                    setTimeout(() => {
                        thongbaoEr.current.style.display = "none";
                    }, 6000);

                })

        } else {
            setErrorMessage("");
            setShowError(true);
        }
    };
    const handleSendMail = async (event) => {
        event.preventDefault();

        await postEmail(data.auth)
            .then((res) => {
                if (res.status === 200) {
                    setAnnouncement('Sending email success')
                    announcements.current.style.top = '-120px';
                    setTimeout(() => {
                        announcements.current.style.top = '-240px';
                    }, 3000);
                    setShowSubmitButton(true);
                }
            })
            .catch(err => {
                setAnnouncement("Sending email failed")
                announcements.current.style.top = '-120px';
                setTimeout(() => {
                    announcements.current.style.top = '-240px';
                }, 3000);
            })

    };
    const handleKeyPress = (event) => {
        // Ngăn chặn sự kiện mặc định của phím Enter
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    useEffect(() => {

        if (!data.auth?.email) {
            navigate('/signup');
        }
    }, [data.auth?.email]);

    return (
        <section className='section-vertify'>
            {!isCorrectOTP ? (
                <div>
                    <div className='announcement' ref={announcements}>{announcement}</div>
                    <div id='thongbaoSignUp' ref={thongbao}>
                        Sign Up Success
                    </div>
                    <div id='thongbaoMaErr' ref={thongbaoEr} >
                        Code is incorrect
                    </div>
                    <h2 className="heading">Verify Account</h2>
                    <p className="message">Please enter the 6-digit verification code sent to email {data.auth?.email} </p>
                    <div className="form" onKeyDown={handleKeyPress} tabIndex="0">
                        <div className="otp-inputs">
                            {otpValues.map((value, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    value={value}
                                    onChange={(event) => handleInputChange(index, event.target.value)}
                                    onKeyDown={(event) => handleBackspace(event, index)}
                                    onFocus={() => handleFocus(index)}
                                    onBlur={handleBlur}
                                    onClick={() => inputRefs.current[index].focus()}
                                    required
                                    className={`input-vertify ${focusedIndex === index ? 'focused' : ''}`}
                                    ref={(input) => (inputRefs.current[index] = input)}
                                    maxLength={1}
                                    style={{ textAlign: 'center' }}
                                />
                            ))}
                        </div>

                        <div className='button-verify-wrapper'>
                            <button className="send-code-button" onClick={handleSendMail}>Send Code</button>
                            {showSubmitButton && (
                                <button className='submit-button' onClick={handleSubmit}>Submit</button>
                            )}
                        </div>
                    </div>
                    {showError && (
                        <div className="error-box">
                            <i className='bx bxs-x-circle'></i> Please enter the full and valid OTP codes
                        </div>
                    )}
                </div>
            ) : (
                <div className="success">
                    <h2>Verification Successful</h2>
                    <img src={verifiedImage} alt="Verified" style={{ width: '100px' }} />
                </div>
            )}
        </section>
    );
}


