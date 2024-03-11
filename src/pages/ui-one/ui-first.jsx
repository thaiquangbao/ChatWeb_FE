import React, { useRef, useState, useContext, useEffect } from 'react'
import './ui.scss'
import Item from '../../component/item-mess/item'
import { AuthContext } from '../../untills/context/AuthContext'
import { Link, useNavigate } from 'react-router-dom';
import { Mess } from './component/mess';
import { getListRooms } from '../../untills/api';
import { SocketContext } from '../../untills/context/SocketContext';
export const UiFirst = () => {
    const formRef = useRef(null);
    //1 dong moi
    const overla = useRef(null);
    const formRefTT = useRef(null);
    const formRefG = useRef(null);
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const { user } = useContext(AuthContext);
    const [homemess, setHomemess] = useState();
    const [nameRoom, setNameRoom] = useState();
    const [avatar, setAvatar] = useState();
    const socket = useContext(SocketContext);
    useEffect(() => {
        socket.on('connected', () => console.log('Connected'));
        socket.on('onRooms', roomSocket =>{
            setRooms(prevRooms => [...prevRooms, roomSocket]);
        })
        return () => {
            socket.off('connected');
            socket.off('onRooms')
        }
    },[])
    const getDisplayUser = (room) => {
        return room.creator._id === user?._id
        ? room.recipient : room.creator;
    };
    const getDisplayAuthor = (room) => {
        const role = "Bạn"
        const name = room.lastMessageSent.author.fullName;
        const lastTwoChars = name.slice(-9);
        return room.lastMessageSent.author.email === user?.email
        ? role : lastTwoChars;
    };
    const getDisplayLastMessages = (messages) => {
        const message = messages.lastMessageSent.content;
        const lastMessage = `...${message.slice(-20)}`;
        return lastMessage;
    }
    useEffect(() =>{
        const fetchData = async () => {
            getListRooms()
            .then(res => {
                setRooms(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        }
        fetchData();
         
    },[])
    const handleButtonClickGroup = () => {
        if (formRefG.current.style.display === 'block') {
            //1 dong moi
            overla.current.style.display = 'none';
            formRefG.current.style.display = 'none';
        } else {
            //1 dong moi
            overla.current.style.display = 'block';
            formRefG.current.style.display = 'block';
        }
    };
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
    const handleButtonClick = () => {
        if (formRef.current.style.display === 'block') {
            //1 dong moi
            overla.current.style.display = 'none';
            formRef.current.style.display = 'none';
        } else {
            overla.current.style.display = 'block';
            formRef.current.style.display = 'block';

        }
    };
    const handleButtonDe = () => {
        formRef.current.style.display = 'none';
        //1 dong moi
        overla.current.style.display = 'none';
    };
    const handleButtonDeTT = () => {
        formRefTT.current.style.display = 'none';
        //1 dong moi
        overla.current.style.display = 'none';
    };
    const handleButtonDeG = () => {
        formRefG.current.style.display = 'none';
        overla.current.style.display = 'none';
    };
    

    const PageMess = () => {
        if (!homemess) {
            return (


                <div className="baoquat">
                    <div>
                        <div style={{ fontSize: '50px', padding: '50px' }}>Welcome to </div>
                        <div style={{ fontSize: '120px', color: ' rgb(240, 143, 23)', paddingLeft: '200px' }}>ZenChat </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <Mess id={homemess} nameRoom={nameRoom} avatar={avatar} />
            )
        }
    }
    return (
        <div className='container'>
            {/* 1 dong moi */}
            <div id="overlay" ref={overla}></div>
            <div className='wrapper'>
                <div className='section-one'>
                    <div className='list-icon'>
                        {/* doi 5 dong nay */}
                        <Link><i className='bx bx-home'></i></Link>
                        <Link to={'/contact'}> <i className='bx bxs-contact' ></i></Link>
                        <Link><i className='bx bx-cog' ></i></Link>
                        <Link to={'/cloud'}> <i className='bx bx-cloud' ></i></Link>
                        <Link> <i className='bx bx-briefcase'></i></Link>



                    </div>
                    <div className='avt'>
                        <button className='btn-avt' onClick={handleButtonClickTT}><img src={user.avatar} alt="" style={{ width: '100%', borderRadius: "50px" }} /></button>


                    </div>
                </div>
                <div className='section-two'>
                    <div className='bar-search'>
                        <i className='bx bx-search-alt-2' ></i>
                        <input type="search" placeholder='search' />
                        <button onClick={handleButtonClick}><i className='bx bx-user-plus' ></i></button>
                        <button onClick={handleButtonClickGroup}><i className='bx bx-group'></i></button>
                    </div>
                    <div id='myForm' ref={formRef}>
                        <form >
                            <div className='titleadd'>
                                <h2>Add friend</h2>
                            </div>
                            <div>
                                <span className='ttadd'>+84<input type="tel" placeholder='Number phone' required></input></span>
                            </div>
                            <div className='endAdd'>
                                <button onClick={handleButtonDe} >Cancel</button>
                                <input type="submit" value="Search" className='timKiem' />
                            </div>

                        </form>
                    </div>


                    <div id='myFormG' ref={formRefG}>
                        <form >
                            <div className='titleaddG'>
                                <h2>Add group</h2>
                            </div>
                            <div>
                                <span className='ttaddG'><i className='bx bx-image' ></i><input type="text" placeholder='Name group' required></input></span>
                            </div>
                            <div className='ctaddG'>
                                <div className='ctaddG1'>
                                    <div className='dladd'>
                                        <input type="checkbox" value='tuananh' />TUAN ANH
                                    </div>
                                    <div className='dladd'>
                                        <input type="checkbox" value='bảo' />BAO
                                    </div>

                                </div>
                                <div className='ctaddG2'>
                                    <div>
                                        Đã chọn 1/100
                                    </div>
                                    <div>

                                    </div>
                                </div>
                            </div>
                            <div className='endAddG'>
                                <button onClick={handleButtonDeG} >Cancel</button>
                                <input type="submit" value="Search" className='timKiem' />
                            </div>

                        </form>
                    </div>
                    {/* doi het cai form nay */}
                    <div id='myFormTT' ref={formRefTT}>
                        < h3>Personal Information <button className='btn-off' onClick={handleButtonDeTT}><i className='bx bx-x'></i></button></h3>

                        <form >
                            <img id='background' src='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' alt="" />
                            <div className='image-name'>
                                <img src={user.avatar} alt="" style={{ width: '80px', borderRadius: "50px", border: '1px solid black' }} />
                                <span id='name'>{user.fullName}</span><br /><br />
                            </div>
                            <div className='infor'>
                                <label >Gender:</label>
                                <span id='gender'>Male</span> <br /><br />
                                <label>Date of Birth:</label>
                                <span id='birthday'>{user.dateOfBirth}</span> <br /><br />
                                <label>Email:</label>
                                <span id='birthday'>{user.email}</span> <br /><br />
                                <label >Phone Number:</label>
                                <span id='phone'>{user.phoneNumber}</span> <br /><br />
                            </div>

                        </form>
                        <button className='btn-update-infor'>Update </button>
                    </div>
                    {/* <div id='myFormTT' ref={formRefTT}>
                        <form >
                            <div>Personal Information </div>
                            <label for="name">Name:</label>
                            <input type="text" id="name" required /><br /><br />
                            <label for="gender">Gender:</label>
                            <select id="gender"  required>
                                <option value="">Select your gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select> <br />
                            <label for="birthday">Date of Birth:</label>
                            <input type="date" id="birthday" required /><br /><br />

                            <label for="phone">Phone Number:</label>
                            <input type="tel" id="phone" required /><br /><br />
                            <input type="submit" value='capnhat' />
                        </form>
                    </div> */}
                    <div className='list-tt'>
                        {rooms.map(room => (
                            <Item key={room._id} link={getDisplayUser(room).avatar} name={getDisplayUser(room).fullName} tt={getDisplayAuthor(room)} action={getDisplayLastMessages(room)} time={'3gio'} onClick={() => {setHomemess(room._id); 
                                setAvatar(getDisplayUser(room).avatar);
                                setNameRoom(getDisplayUser(room).fullName)
                             }} />
                            
                        ))}
                    </div>

                </div>
                <PageMess />
            </div>
        </div>
    )
}