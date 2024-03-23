import React, { useRef, useState, useContext, useEffect } from 'react'
import './ui.scss'
import Item from '../../component/item-mess/item'
import { AuthContext } from '../../untills/context/AuthContext'
import { Link, useNavigate } from 'react-router-dom';
import { Mess } from './component/mess';
import { getListRooms, logoutUser, removeCookie } from '../../untills/api';
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
    const [searchValue, setSearchValue] = useState('');
    const [showLogout, setShowLogout] = useState(false);
    const [isAddClicked, setIsAddClicked] = useState(false);
     // console.log(newMessage === true);
        // if (newMessage === true) {
        //     socket.on('getRooms', updatedRooms => {
        //         console.log(updatedRooms);
        //         setRooms(preRooms => [...preRooms, updatedRooms])
        //     })
        // }
        const updateLastMessage = (updatedRoom) => {
            setRooms(prevRooms => {
                // Cập nhật phòng đã được cập nhật
                return prevRooms.map(room => {
                    if (room._id === updatedRoom._id) {
                        return updatedRoom;
                    }
                    return room;
                });
            });
        };
    const updateListRooms = (updatedRoom) => {
        setRooms(prevRooms => {
            // Cập nhật phòng đã được cập nhật
            return prevRooms.map(room => {
                if (room._id === updatedRoom._id) {
                    return updatedRoom;
                }
                return room;
            });
        });
    };
    useEffect(() => {
        socket.on('connected', () => console.log('Connected'));
        socket.on('onRooms', roomSocket =>{
            setRooms(prevRooms => [...prevRooms, roomSocket]);
            
        })
        socket.on(user.email, roomSocket => {
            updateListRooms(roomSocket.rooms)
        });
        return () => {
            socket.off('connected');
            socket.off('onRooms');
            socket.off(user.email)
        }
    },[])
    const getDisplayUser = (room) => {
        return room.creator._id === user?._id
        ? room.recipient : room.creator;
    };
    const getDisplayAuthor = (room) => {
         const nullRoll = "";
        if (room.lastMessageSent === undefined) {
           
            return nullRoll;
        }
        const role = "Bạn:";
        const name = room.lastMessageSent.author.fullName;
        const lastTwoChars = `${name.slice(-9)}:`;
        return room.lastMessageSent.author.email === user?.email
            ? role: lastTwoChars;
    };
    const getDisplayLastMessages = (messages) => {
        const message = "";
        if (messages.lastMessageSent === undefined) {
            return message;
        }
        else{
             const message = messages.lastMessageSent.content;
            const lastMessage = `...${message.slice(-20)}`;
            return lastMessage;
        }
       
    }
    useEffect(() =>{
        const fetchData = async () => {
            getListRooms()
            .then(res => {
                setRooms(res.data);
            })
            .catch(err => {
                console.log(err);
                console.log("Đã rơi zô đây");
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
                        <div style={{ fontSize: '50px', padding: '50px' }}> <span style={{ animation: 'bouncel2 1s' }}>W</span><span style={{ animation: 'bouncel2 1.2s' }}>e</span><span style={{ animation: 'bouncel2 1.4s' }}>l</span><span style={{ animation: 'bouncel2 1.6s' }}>c</span><span style={{ animation: 'bouncel2 1.8s' }}>o</span><span style={{ animation: 'bouncel2 2s' }}>m</span><span style={{ animation: 'bouncel2 2.2s' }}>e</span></div>
                        <div style={{ fontSize: '120px', color: ' rgb(240, 143, 23)', paddingLeft: '200px' }}><span style={{ animation: 'bouncel2 2.4s' }}>Z</span><span style={{ animation: 'bouncel2 2.6s' }}>e</span><span style={{ animation: 'bouncel2 2.8s' }}>n</span><span style={{ animation: 'bouncel2 3s' }}>C</span><span style={{ animation: 'bouncel2 3.2s' }}>h</span><span style={{ animation: 'bouncel2 3.4s' }}>a</span><span style={{ animation: 'bouncel2 3.6s' }}>t</span> </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <Mess id={homemess} nameRoom={nameRoom} avatar={avatar} updateLastMessage={updateLastMessage}/>
            )
        }
    }
    

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };
    const SearchRooms = rooms.filter(room => {
        const roomName = getDisplayUser(room).fullName.toLowerCase();
        return roomName.includes(searchValue.toLowerCase());
    });
    const handleAddClick = () => {
        setIsAddClicked(!isAddClicked);
    };
    const handleLogoutClick = () => {
        setShowLogout(true);
    };
    const handleConfirmLogout = () => {
        logoutUser({})
        .then(res => {
            removeCookie()
            setTimeout(() => {
                navigate("/login");
            }, 1000);
           
        })
        .catch(err => {
            alert("Lỗi hệ thống")
        })
    };
    const handleCancelLogout = () => {
        setShowLogout(false);
    };
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
                        <Link onClick={handleLogoutClick}><i className='bx bx-log-out'></i></Link>


                    </div>
                    <div className='avt'>
                        <button className='btn-avt' onClick={handleButtonClickTT}><img src={user.avatar} alt="" style={{ width: '100%', borderRadius: "50px" }} /></button>


                    </div>
                    {showLogout && (
                    <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="modal-content" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
                            <p>Are you sure you want to sign out?</p>
                            <button onClick={handleConfirmLogout} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '5px', cursor: 'pointer', marginLeft: '25px', marginRight: '30px' }}>Yes</button>
                            <button onClick={handleCancelLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 28px', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>
                    )}
                </div>
                <div className='section-two'>
                    <div className='bar-search'>
                        
                        <input type="search" onChange={handleSearchChange} placeholder='search' />
                        <button onClick={handleButtonClick}><i className='bx bx-user-plus' ></i></button>
                        <button onClick={handleButtonClickGroup}><i className='bx bx-group'></i></button>
                    </div>
                    <div id='myForm' ref={formRef} >
                        <form >
                            <div className='titleadd' style={{ borderBottom: '1px solid black' }}>
                                <h2 style={{ marginLeft: '20px' }}>Add friend</h2>
                            </div>
                            <div style={{ marginTop: '30px' }}>
                                <span className='ttadd'>  <img width={'30px'} style={{ marginLeft: '10%' }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png" alt="Flag of Vietnam" /><input style={{ marginLeft: '30px', width: '300px', border: '1px solid black', padding: '13px 18px', borderRadius: '100px', background: 'rgb(192, 190, 189)', fontSize: '20px' }} type="tel" placeholder='Number phone' required></input></span>
                            </div>
                            {/* st chổ này */}
                            <div className='show-add'>
                                <div className='thongtin-add' style={{ margin: '30px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png" alt="Flag of Vietnam" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                                    <span style={{ flex: '1', marginRight: '10px', fontWeight: 'bold', fontSize: '20px' }}>Tuấn Anh</span>
                                    <button onClick={handleAddClick} style={{ background: isAddClicked ? 'rgb(204, 82, 30)' : 'green', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}> {isAddClicked ? 'Undo' : 'Add'}</button>
                                </div>


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
                        {SearchRooms.map(room => (
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