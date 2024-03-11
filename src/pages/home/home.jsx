import React from 'react'
import './home.scss';
import { Link } from 'react-router-dom';
const Home = () => {
   
    return (
        <section>
            <Link to={'/login'} className='link-login'><button className='sign-in' >Sign in</button></Link >
            <Link to={'/signUp'} className='link-login'><button className='sign-up' >Sign up</button></Link >

        </section>
    )
}

export default Home