import React, { useContext, useState, useEffect, useRef } from 'react'
import './signUp.scss'
import { Link, useNavigate } from 'react-router-dom';
import { postRegister, removeToken, getToken } from '../../untills/api';
import { Auth } from '../../untills/context/SignupContext';
import { AxiosError } from 'axios';
export const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [passWord, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const { handler } = useContext(Auth)
    const naviGate = useNavigate();

    const regexPatterns = {
        // fullName: /^[a-zA-Z\s_-]+$/,
        fullName: /^(?:[A-ZÀ-Ỹ][a-zà-ỹ]*\s?)+$/,


        phoneNumber: /^(0|\+84)[1-9]{9}$/,
        //phoneNumber: /^\+84[1-9]{9}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        password: /^[a-zA-Z\d]{6,}$/,

    };
    useEffect(() => {
        removeToken();
        handler.setAuth(undefined)

    })
    const errFormRef = useRef([])
    const [errForm, setErrForm] = useState('')
    const handleGenderChange = async (e) => {
        const newGender = e.target.value;
        setGender(newGender);
    }
    const handleSignUp = async (event) => {
        event.preventDefault();
        const avatar = "https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain";
        const background = "https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain"
        let processedPhoneNumber = phoneNumber;
        if (phoneNumber.startsWith('0')) {
            processedPhoneNumber = `(+84)${phoneNumber.slice(1)}`;
        }
        if (phoneNumber.startsWith('+84')) {
            processedPhoneNumber = `(+84)${phoneNumber.slice(1)}`;
        }
        if (!regexPatterns.fullName.test(fullName)) {
            setErrForm('Please enter the name in the correct format.')
            errFormRef.current.style.top = '0';
            setTimeout(() => {
                // LOILOILOILOILOILOILOILOILOILOILOILOILOILOILOILOI
                errFormRef.current.style.top = '-100px';
            }, 3000);
            return;
        }

        if (!regexPatterns.email.test(email)) {
            setErrForm('Please enter email address in correct format.');
            errFormRef.current.style.top = '0';
            setTimeout(() => {
                errFormRef.current.style.top = '-100px';
            }, 3000);
            return;
        }
        const data = {
            fullName,
            dateOfBirth,
            phoneNumber: processedPhoneNumber,
            email,
            passWord,
            gender,
            avatar,
            background
        }
        try {
            await postRegister(data)
                .then((res) => {
                    handler.setAuth(res.data.userDetail);
                    naviGate('/vertify');
                })
                .catch(err => {
                    if (AxiosError.ERR_BAD_REQUEST) {
                        setErrForm(err.response.data.message);
                        errFormRef.current.style.top = '0';
                        setTimeout(() => {
                            errFormRef.current.style.top = '-100px';
                        }, 3000);
                    }


                })
        } catch (error) {
            console.log(error);
        }

    };

    return (
        <section>
            <div className='wrapper'>
                <div className='errForm' ref={errFormRef}>{errForm}</div>
                <form onSubmit={handleSignUp} id="form-signUp" >
                    <h1 className="form-heading">Sign up</h1>
                    <div className="form-group">
                        <input type="text" className='form-input' placeholder='FullName' value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <input type="date" className='form-input' value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <input type="tel" className='form-input' placeholder='number-phone' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <input type="text" className='form-input' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <input type="password" className='form-input' placeholder='Password' value={passWord} onChange={(e) => setPassword(e.target.value)} />
                        <div id="eyee">
                            <i className="far fa-eye"></i>
                        </div>
                    </div>
                    {/* <div className="form-group">
                        <input type="text" className='form-input' placeholder='Avatar' value={gender} onChange={(e) => setGender(e.target.value)} />
                    </div> */}
                    <select className='form-input' onChange={handleGenderChange} style={{ width: '100%', border: '0', outline: '0', background: 'transparent', color: 'white', borderBottom: ' 1px solid #fff', animation: 'bouncel 2s' }}>
                        <option value='null' style={{ color: 'black' }}>Select</option>
                        <option value="Nam" style={{ color: 'black' }}>Nam</option>
                        <option value="Nữ" style={{ color: 'black' }}>Nữ</option>
                    </select>
                    {/* <Link to={'/vertify'} className='link-login'></Link > */}
                    <button className='form-submit-up' type='submit' >Sign Up</button>
                    <div className='in'>
                        <span>Already have an account?</span>
                        <Link to={'/login'} className='link-login'>Sign In</Link >
                    </div>


                </form>
            </div>
        </section>
    )
}
