import React, { useEffect, useRef, useState } from 'react'
import './login.scss'
import { Link, useNavigate } from 'react-router-dom';
import { getCookieExist, postLogin } from '../../untills/api';
import Notification, { statusMessage } from '../../component/notification';
import { useContext } from 'react';
import { globalContext } from '../../component/context/globalContext';


const Login = () => {
    const { handler } = useContext(globalContext)
    const thongbao = useRef(null);
    const [username, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const naviGate = useNavigate();
    useEffect(() => {
        getCookieExist()

            .then((data) => {
                if (data.status === 200) {

                    naviGate("/login")
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
    const handleLogin = async (e) => {

        e.preventDefault();
        const data = {
            username,
            password
        }
        try {
            await postLogin(data)

                .then(data => {
                    naviGate("/page");
                })
                .catch(err => {
                    if (err.response.status === 401) {

                        thongbao.current.style.right = "0";
                        setTimeout(() => {
                            thongbao.current.style.right = "-500px";
                        }, 1000);
                    }
                    else {
                        console.log("Lỗi khác");
                    }
                })

            // .then(data => {
            //     console.log(data);
            // })
            // .catch(err => {
            //     console.log(err, "đây");
            // })
            //naviGate('/vertify');
            //setTimeout(() => naviGate('/page1'),3000);
        } catch (error) {
            console.log(error);
        }

    }
    return (
        <section>
            <div className='wrapper'>
                <div id='thongbao' ref={thongbao}>
                    Incorrect username or password.
                </div>

                <form id="form-login" onSubmit={handleLogin}>
                    <h1 className="form-heading">Sign in</h1>
                    <div className="form-group">

                        <input type="text" className='form-input' placeholder='Email' value={username} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <input type="password" className='form-input' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <div id="eye">
                            <i className="far fa-eye"></i>
                        </div>    
                        </div>
                    {/* <Link to={'/vertify'} className='link-login'></Link > */}
                    <button className='form-submit-in' type='submit' >Sign In</button>
                    <div className='mm'>
                        <span >Don't have an account yet?</span>
                        <Link to={'/signup'} className='link-login'>Sign up</Link >
                    </div>
                    {/* <input type="submit" className='form-submit' value='Login' />
                    <input type="submit" className='form-submit' value='Sign-up' /> */}
                </form>
            </div>
        </section>
    )
}

export default Login