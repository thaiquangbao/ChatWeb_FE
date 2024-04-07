import React, { useRef } from 'react'
// import './cloud.scss'
import Item from '../../component/item-mess/item'
import { Link } from 'react-router-dom'

export const UiCloud = () => {
    const formRef = useRef(null);
    //1 dong moi
    const overla = useRef(null);
    const formRefTT = useRef(null);
    const formRefG = useRef(null);
    //doi doan nay
    const handleButtonClickTT = () => {
        if (formRefTT.current.style.display === 'block') {
            overla.current.style.display = 'none';
            formRefTT.current.style.display = 'none';
        } else {
            overla.current.style.display = 'block';
            formRefTT.current.style.display = 'block';
        }
    };
    //

    const handleButtonDeTT = () => {
        formRefTT.current.style.display = 'none';
        //1 dong moi
        overla.current.style.display = 'none';
    };
    return (
        <div className='container'>
            <div id="overlay" ref={overla}></div>
            <div className='wrapper'>
                <div className='section-one'>
                    <div className='list-icon'>
                        <Link to={'/page1'}> <i className='bx bx-home'></i></Link>
                        <Link to={'/uidsbb'} > <i className='bx bxs-contact' ></i></Link>
                        <Link><i className='bx bx-cog' ></i></Link>
                        <Link to={'/cloud'}> <i className='bx bx-cloud' ></i></Link>
                        <Link> <i className='bx bx-briefcase'></i></Link>
                    </div>
                    <div className='avt'>
                        <button className='btn-avt' onClick={handleButtonClickTT}><img src="https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain" alt="" style={{ width: '80%', borderRadius: "50px" }} /></button>

                        <span>tun anh</span>
                    </div>
                </div>
                <div className='section-two'>
                    
                    
                  
                    <div id='myFormTT' ref={formRefTT}>
                        < h3>Personal Information <button className='btn-off' onClick={handleButtonDeTT}><i class='bx bx-x'></i></button></h3>

                        <form >
                            <img id='background' src='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' alt="" />
                            <div className='image-name'>
                                <img src='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' alt="" style={{ width: '80px', borderRadius: "50px", border: '1px solid black' }} />
                                <span id='name'>Tuấn Anh</span><br /><br />
                            </div>
                            <div className='infor'>
                                <label >Gender:</label>
                                <span id='gender'>Male</span> <br /><br />
                                <label>Date of Birth:</label>
                                <span id='birthday'>25/6/2002</span> <br /><br />
                                <label >Phone Number:</label>
                                <span id='phone'>0919199199</span> <br /><br />
                            </div>

                        </form>
                        <button className='btn-update-infor'>Update </button>
                    </div>
                    {/* <div className='item'>
                        <div className='item-name'>
                            <img src="https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain" alt="" style={{ width: '50px', borderRadius: "50px" }} />
                            <div className='name'>
                                <span>Tuananh</span>
                                <div>
                                    <span>ban:</span>
                                    <span>tuananh</span>
                                </div>
                            </div>
                        </div>
                        <span>8h</span>

                    </div> */}
                    <div className='list-tt'>
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />
                        <Item link={'https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain'} name={'Tuan Anh'} tt={'ban'} action={'di choi'} time={'8h'} />

                    </div>

                </div>
                <div className='section-three'>
                    <div className='title' >
                        <div className='title-tt'>
                            <img src='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' alt="" style={{ width: '50px', borderRadius: "50px", marginLeft: "5px" }} />
                            <div className='inf-title'>
                                <span className='name-title'>My Cloud</span>
                            </div>
                        </div>

                    </div>

                    <div className='inf-mess'>
                        <div className='mess-me'>
                            <img src='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' alt="" style={{ width: '50px', borderRadius: "50px" }} />
                            <div className='inf-you'>
                                <div className='tt'>
                                    <span>Tuan Anh</span>
                                    <span>10h19</span>
                                </div>
                                <div className='content'>
                                    <p>Day la cloud</p>
                                </div>
                            </div>
                        </div>
                        <div className='mess-me'>
                            <img src='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' alt="" style={{ width: '50px', borderRadius: "50px" }} />
                            <div className='inf-you'>
                                <div className='tt'>
                                    <span>Tuan Anh</span>
                                    <span>10h19</span>
                                </div>
                                <div className='content'>
                                    <p>Cloud cua toi</p>
                                </div>
                            </div>
                        </div>
                        <div className='mess-me'>
                            <img src='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' alt="" style={{ width: '50px', borderRadius: "50px" }} />
                            <div className='inf-you'>
                                <div className='tt'>
                                    <span>Tuan Anh</span>
                                    <span>10h19</span>
                                </div>
                                <div className='content'>
                                    <p>cloud </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='soan'>
                        <div className='nd'>
                            <input type="text" placeholder='Type a message here..' />
                        </div>
                        <div className='cachthuc'>
                            <i className='bx bx-smile'></i>
                            <i className='bx bx-image-alt' ></i>
                            <i className='bx bx-link-alt' ></i>
                            <i className='bx bxs-send'></i>
                        </div>

                    </div>
                </div>
                <div className='section-four-cloud'>
                    <div className='title'>
                        <h3>My cloud</h3>
                    </div>

                    <div className='section-four-wrapper'>

                        <div className='avt'>
                            <img src="https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain" alt="" style={{ width: '70px', borderRadius: "50px" }} />
                        </div>

                        <div className='inf'>
                            <p>Cloud</p>
                            <i className='bx bx-edit-alt'></i>
                        </div>

                        <div className='cloud-description'>
                            <h5>Store and access your important content quickly</h5>
                        </div>

                        <div className='video'>
                            <div className='title-video'>
                                <span>Video</span>
                                <i className='bx bx-image' ></i>
                            </div>
                            <div className='videos'>
                                <img src="https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain" alt="" style={{ width: '90%' }} />
                                <img src="https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain" alt="" style={{ width: '90%' }} />
                                <img src="https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain" alt="" style={{ width: '90%' }} />

                            </div>
                            <div className='button-videos'>
                                <button className='button-video'>See all videos</button>

                            </div>


                        </div>
                        <div className='file'>
                            <div className='title-file'>
                                <span>File</span>

                            </div>

                        </div>

                        <div className='link'>
                            <div className='title-link'>
                                <span>Link</span>

                                <div className='link-information'>
                                    <i className='bx bx-link'></i>
                                    <div className='url-link'>
                                        <p className='long-link'>https://google.com/abcxyz</p>
                                        <p className='short-link'>google.com</p>
                                    </div>
                                </div>



                            </div>

                            <div className='button-links'>
                                <button className='button-link'>See all links</button>

                            </div>

                        </div>

                    </div>


                </div>
            </div>
        </div>
    )
}
