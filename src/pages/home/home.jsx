import React from 'react'
import './home.scss';
import { Link } from 'react-router-dom';
import exampleImage from './logo.jpg'
const Home = () => {
   
    return (
        <section className='section-home'>
              <img src={exampleImage} alt="" style={{ position: 'fixed', top: '10%', animation: 'home2 1.5s' }} />
            <span style={{ fontSize: '160px', color: 'orange', position: 'fixed', top: '50%', transform: 'translateY(-50%)', fontFamily: 'Montserrat', animation: 'home 1s' }}> ZEN CHAT</span>
            <span style={{ fontSize: '20px', color: 'orange', position: 'fixed', top: '60%', transform: 'translate(70%)', fontFamily: 'Montserrat', animation: 'home2 1s' }}>🌟 Let's Explore ZenChat - Multifunctional Chat Platform! 🌟</span>
            <Link to={'/login'} className='link-login'><button className='sign-in' >Sign in</button></Link >
            <Link to={'/signUp'} className='link-login'><button className='sign-up' >Sign up</button></Link >

        </section>
    )
}

export default Home