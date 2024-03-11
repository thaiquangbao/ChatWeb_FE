import React, { useContext, useState, useEffect, useRef } from 'react'
import './signUp.scss'
import { Link, useNavigate } from 'react-router-dom';
import { postRegister } from '../../untills/api';
import { SignupContext } from '../../untills/context/SignupContext';
import { Auth } from '../../untills/context/SignupContext';
import { set } from 'react-hook-form';
import { AxiosError } from 'axios';
export const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [passWord, setPassword] = useState('');
    const [avatar, setAvatar] = useState('');
    const { handler } = useContext(Auth)
    const naviGate = useNavigate();

    const regexPatterns = {
        fullName: /^[a-zA-Z\s_-]+$/,

        phoneNumber: /^(0|\+84)[1-9]{9}$/,
        //phoneNumber: /^\+84[1-9]{9}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        password: /^[a-zA-Z\d]{6,}$/,

    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.removeItem('token')
            handler.setAuth(undefined)
        }
    })
    const errFormRef = useRef([])
    const [errForm, setErrForm] = useState('')
    const handleSignUp = async (event) => {
        event.preventDefault();
        const data = {
            fullName,
            dateOfBirth,
            phoneNumber,
            email,
            passWord,
            avatar
        }
        let processedPhoneNumber = phoneNumber;
        if (phoneNumber.startsWith('0')) {
            processedPhoneNumber = `+84${phoneNumber.slice(1)}`;
        }
        // if (!regexPatterns.phoneNumber.test(processedPhoneNumber)) {

        //     alert(phoneNumber);
        //     return;
        // }
        setPhoneNumber(processedPhoneNumber)


        if (!regexPatterns.fullName.test(fullName)) {
            setErrForm('Please enter the name in the correct format.')
            errFormRef.current.style.top = '0';
            setTimeout(() => {
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

        try {
            await postRegister(data)
                .then((res) => {

                    localStorage.setItem('token', res.data.token);
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
                    <div className="form-group">
                        <input type="text" className='form-input' placeholder='Avatar' value={avatar} onChange={(e) => setAvatar(e.target.value)} />
                    </div>
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
