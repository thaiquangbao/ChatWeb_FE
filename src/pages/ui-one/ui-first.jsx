import React, { useRef, useState, useContext, useEffect } from 'react'
import './ui.scss'
import Item from '../../component/item-mess/item'
import { AuthContext } from '../../untills/context/AuthContext'
import { Link, useNavigate } from 'react-router-dom';
import { Mess } from './component/mess';
import { getListRooms, logoutUser, removeCookie, findAuth, createRooms } from '../../untills/api';
import { SocketContext } from '../../untills/context/SocketContext';
import { useUser } from './component/findUser'
export const UiFirst = () => {
    const [isActive, setIsActive] = useState(false); // Cảm giác nút bấm
    const [isLoading, setIsLoading] = useState(false); // modal loading xoay xoay


    const formRef = useRef(null);
    //1 dong moi
    const overla = useRef(null);
    const formRefTT = useRef(null);
    const formRefG = useRef(null);
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const { user } = useContext(AuthContext);
    const [homemess, setHomemess] = useState();
    const [lastMessagesDeleted, setLastMessagesDeleted] = useState();
    const [nameRoom, setNameRoom] = useState();
    const [avatar, setAvatar] = useState();
    const socket = useContext(SocketContext);
    const [searchValue, setSearchValue] = useState('');
    const [showLogout, setShowLogout] = useState(false);
    const [isAddClicked, setIsAddClicked] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const { handleFindUser } = useUser();
    const [authFound, setAuthFound] = useState([]);
    const [friend, setFriend] = useState();
    const [gender, setGender] = useState();
    const [email, setEmail] = useState();
    const [sdt, setSdt] = useState();
    const [dateBirth, setDateBirth] = useState()
    // console.log(newMessage === true);
    // if (newMessage === true) {
    //     socket.on('getRooms', updatedRooms => {
    //         console.log(updatedRooms);
    //         setRooms(preRooms => [...preRooms, updatedRooms])
    //     })
    // }
    const handleAddClick = () => {
        const message = "hello"
        const authen = [authFound[0].email]
        const email = authen[0]
        const data1 = { email, message }

        createRooms(data1)
            .then(res => {
                if (res.data.message === "Đã tạo phòng với User này ròi") {
                    alert("Đã tạo phòng với User này ròi !!!");
                    return;
                }
                if (res.data.status === 400) {
                    alert("Không thể nhắn tin với chính bản thân mình !!!");
                    return;
                }
                else {
                    // window.location.reload();
                    formRef.current.style.display = 'none';
                }
            })
            .catch(err => {
                alert("Lỗi hệ thống")
            })
    };
    const updateLastMessage = (updatedRoom) => {
        setRooms(prevRooms => {
            // Cập nhật phòng đã được cập nhật
            return prevRooms.map(room => {
                if (room === undefined || updatedRoom === undefined) {
                    return room;
                }
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
                if (room === undefined || updatedRoom === undefined) {
                    return room;
                }
                if (room._id === updatedRoom._id) {
                    return updatedRoom;
                }
                return room;
            });
        });
    };
    useEffect(() => {
        socket.on('connected', () => console.log('Connected'));
        socket.on(user.email, roomSocket => {
            setRooms(prevRooms => [...prevRooms, roomSocket]);

        })
        socket.on(user.email, roomSocket => {
            updateListRooms(roomSocket.rooms)
        });

        return () => {
            socket.off('connected');
            socket.off(user.email);
            socket.off(user.email)

        }
    }, [])
    useEffect(() => {
        socket.on(`updateLastMessages${user.email}`, lastMessageUpdate => {
            setRooms(prevRooms => {
                // Cập nhật phòng đã được cập nhật
                return prevRooms.map(room => {
                    if (room === undefined || lastMessageUpdate === undefined) {
                        return room;
                    }
                    if (room._id === lastMessageUpdate._id) {

                        return lastMessageUpdate;
                    }
                    return room;
                });
            });

        })
        socket.on(`updateLastMessagesed${user.email}`, lastMessageUpdate => {
            setRooms(prevRooms => {
                // Cập nhật phòng đã được cập nhật
                return prevRooms.map(room => {
                    if (room === undefined || lastMessageUpdate === undefined) {
                        return room;
                    }
                    if (room._id === lastMessageUpdate._id) {

                        return lastMessageUpdate;
                    }
                    return room;
                });
            });
        })
        return () => {
            socket.off(`updateLastMessages${user.email}`)
            socket.off(`updateLastMessagesed${user.email}`)
        }
    }, [])
    const getDisplayUser = (room) => {
        if (!room || !room.creator) {
            return;
        }
        else {
            return room.creator._id === user?._id
                ? room.recipient : room.creator;
        }

    };
    const getDisplayAuthor = (room) => {
        const nullRoll = "";
        if (room.lastMessageSent === undefined) {

            return nullRoll;
        }
        if (room.lastMessageSent.author.fullName !== undefined) {
            const role = "Bạn:";
            const name = room.lastMessageSent.author.fullName;
            const lastTwoChars = `${name?.slice(-9)}:`;
            return room.lastMessageSent.author.email === user?.email
                ? role : lastTwoChars;
        }
        const role = "Bạn:";
        const name = room.lastMessageSent.author;
        const lastTwoChars = `${name?.slice(-9)}:`;
        return room.lastMessageSent.email === user?.email
            ? role : lastTwoChars;

    };
    const getDisplayLastMessages = (messages) => {
        const message = "";
        if (messages.lastMessageSent === undefined) {
            return message;
        }

        else if (messages.lastMessageSent.content.endsWith('.jpg') || messages.lastMessageSent.content.endsWith('.png') || messages.lastMessageSent.content.endsWith('.jpeg') || messages.lastMessageSent.content.endsWith('.gif') || messages.lastMessageSent.content.endsWith('.tiff') || messages.lastMessageSent.content.endsWith('.jpe') || messages.lastMessageSent.content.endsWith('.jxr') || messages.lastMessageSent.content.endsWith('.tif') || messages.lastMessageSent.content.endsWith('.tif')) {
            return "Send image";
        }
        else if (messages.lastMessageSent.content.endsWith('.docx') || messages.lastMessageSent.content.endsWith('.pdf') || messages.lastMessageSent.content.endsWith('.pdf')) {
            return "Send file";
        }
        else if (messages.lastMessageSent.content.endsWith('.mp4')) {
            return "Send video";
        }
        else {
            const message = messages.lastMessageSent.content;
            if (message === "") {
                return "Tin nhắn đã được thu hồi";
            }
            const lastMessage = `...${message.slice(-20)}`;
            return lastMessage;
        }

    }
    const getDisplayLastMessagesId = (messages) => {
        const message = "";
        if (messages.lastMessageSent === undefined) {
            return message;
        }
        else {
            const messageHaveId = messages.lastMessageSent._id;
            return messageHaveId;
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            getListRooms()
                .then(res => {
                    // const filteredRooms = res.data.filter(room => room.lastMessageSent);

                    // Chỉ setRooms với các object đã được lọc
                    setRooms(res.data);
                })
                .catch(err => {
                    console.log(err);
                    console.log("Đã rơi zô đây");
                })
        }
        fetchData();

    }, [])
    const handleButtonClickGroup = () => {
        if (formRefG.current.style.display === 'none') {
            //1 dong moi

            formRefG.current.style.display = 'flex';
        } else {
            //1 dong moi

            formRefG.current.style.display = 'none';
        }
    };
    //doi doan nay
    const handleButtonClickTT = () => {
        if (formRefTT.current.style.display === 'none') {

            formRefTT.current.style.display = 'flex';
        } else {

            formRefTT.current.style.display = 'none';
        }
    };
    //
    const handleButtonClick = () => {
        if (formRef.current.style.display === 'flex') {
            //1 dong moi

            formRef.current.style.display = 'none';
        } else {

            formRef.current.style.display = 'flex';

        }
    };
    const handleButtonDe = () => {
        formRef.current.style.display = 'none';
        //1 dong moi

    };
    const handleButtonDeTT = () => {
        formRefTT.current.style.display = 'none';
        //1 dong moi

    };
    const handleButtonDeG = () => {
        formRefG.current.style.display = 'none';

    };
    const handleFoundUser = async (e) => {

        let data = phoneNumber;
        if (phoneNumber.startsWith('0')) {
            data = `(+84)${phoneNumber.slice(1)}`;
        }
        if (phoneNumber.startsWith('+84')) {
            data = `(+84)${phoneNumber.slice(1)}`;
        }
        const result = await handleFindUser(data);

        if (result !== undefined) {
            const obj = [];
            obj.push(result)
            setAuthFound(obj);
            return;
        }

    }
    const handleUpdateUser = () => {
        navigate(`/update_information/${user._id}`)
    }
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };
    const SearchRooms = rooms.filter(room => {
        const nullRoll = "";
        if (room.creator === undefined || room.recipient === undefined) {

            return nullRoll;
        }
        const roomName = getDisplayUser(room).fullName.toLowerCase();
        return roomName.includes(searchValue.toLowerCase());
    });

    const
        handleLogoutClick = () => {



            setShowLogout(true);
        };
    const handleConfirmLogout = () => {
        setIsLoading(true); // Hiển thị modal loading

        // Thiết lập timeout để giữ modal loading hiển thị trong ít nhất 3 giây
        setTimeout(() => {
            // Sau khi đợi 3 giây, thực hiện logoutUser và reload trang sau khi hoàn thành
            logoutUser({})
                .then(res => {
                    removeCookie();
                    // Đợi 1 giây trước khi chuyển hướng đến trang login
                    setTimeout(() => {
                        navigate("/login");
                    }, 1000);
                })
                .catch(err => {
                    setIsLoading(false); // Ẩn modal loading nếu có lỗi xảy ra
                    alert("Lỗi hệ thống");
                });
        }, 1500); // Timeout 2 giây
    };

    const handleCancelLogout = () => {
        setShowLogout(false);
    };
    const [selectedItems, setSelectedItems] = useState([]);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedItems(prevSelectedItems => [...prevSelectedItems, value]);
        } else {
            setSelectedItems(prevSelectedItems => prevSelectedItems.filter(item => item !== value));
        }
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
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button
                                        onClick={() => {
                                            setIsActive(true); // Kích hoạt hiệu ứng khi nút được click
                                            handleConfirmLogout(); // Gọi hàm xác nhận logout
                                        }}
                                        style={{
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 30px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s ease', // Thêm transition cho hiệu ứng màu nền
                                            // Thay đổi màu nền khi nút được nhấn
                                            backgroundColor: isActive ? '#0056b3' : '#007bff',
                                        }}
                                    >
                                        Yes
                                    </button>
                                    {isLoading && ( // Hiển thị modal loading khi isLoading = true
                                        <div className="modal-overlay" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                                            <div className="modal" style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '40px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)', animation: 'fadeIn 0.3s forwards', position: 'relative', width: '30%', height: '20%' }}>
                                                <div className="modal-content" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <p style={{ marginBottom: '40px', fontSize: '20px' }}>Logging out</p>
                                                    <div className="loader" style={{ border: '6px solid #f3f3f3', borderTop: '6px solid #3498db', borderRadius: '50%', width: '60px', height: '60px', animation: 'spin 1s linear infinite' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}





                                    <button onClick={handleCancelLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 28px', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
                                </div>
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
                    <div id='myForm' ref={formRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'none', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', width: '400px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                            <div className='titleadd' style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '24px', color: '#333', textAlign: 'center', marginBottom: '10px' }}>Add Friend</h2>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: '5px', fontSize: '16px', color: '#555' }}>Phone Number:</label>
                                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '5px', border: '1px solid #ccc', transition: 'border-color 0.3s' }}>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png" alt="Flag of Vietnam" width="30" style={{ marginRight: '10px' }} />
                                    <input id="phoneNumber" onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber} style={{ flex: '1', border: 'none', padding: '10px', borderRadius: '5px', fontSize: '16px', outline: 'none' }} type="tel" placeholder="Enter phone number" required />
                                </div>
                            </div>
                            {authFound.map((auth) => (
                                <div key={auth._id} className='show-add' style={{ marginBottom: '20px' }}>
                                    <div className='thongtin-add' style={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={auth.avatar} alt="Flag of Vietnam" width="40" style={{ borderRadius: '50%', marginRight: '10px' }} />
                                        <span style={{ flex: '1', fontWeight: 'bold', fontSize: '18px', color: '#333' }}>{auth.fullName}</span>

                                        <button onClick={handleAddClick} style={{ background: isAddClicked ? 'rgb(204, 82, 30)' : '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }}>{isAddClicked ? 'Undo' : 'Add'}</button>

                                    </div>

                                    <span style={{ padding: "11%", fontWeight: 'bold', color: '#333', fontSize: '15px' }}>PhoneNumber: {auth.phoneNumber}</span>
                                </div>
                            ))}
                            <div className='endAdd' style={{ display: 'flex', justifyContent: 'center' }}>
                                <button onClick={handleButtonDe} style={{ backgroundColor: '#ccc', color: '#333', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px', fontSize: '16px', fontWeight: 'bold', transition: 'background-color 0.3s' }}>Cancel</button>
                                <input onClick={handleFoundUser} type="submit" value="Search" className='timKiem' style={{ backgroundColor: 'rgb(240, 143, 23)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'background-color 0.3s' }} />
                            </div>
                        </div>
                    </div>


                    {/* <div id='myFormG' ref={formRefG}>
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
                    </div> */}
                    <div id='myFormG' ref={formRefG} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'none', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                        <form style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', width: '500px', height: '500px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)' }}>
                            <div className='titleaddG' style={{ marginBottom: '30px', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '28px', color: '#333', fontWeight: 'bold', marginBottom: '10px' }}>Add group</h2>
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <span className='ttaddG' style={{ display: 'flex', alignItems: 'center' }}>
                                    <i className='bx bx-image' style={{ marginRight: '10px', fontSize: '30px' }}></i>
                                    <input type="text" placeholder='Name group' required style={{ width: '100%', border: '2px solid #ccc', padding: '12px', borderRadius: '5px', fontSize: '16px', outline: 'none', transition: 'border-color 0.3s' }} />
                                </span>
                            </div>
                            <div className='ctaddG' style={{ display: 'flex', alignItems: 'flex-start', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                                <div className='ctaddG1' style={{ flex: 1, overflowY: 'scroll', scrollbarWidth: 'auto', height: '250px' }}>
                                    <div className='dladd' style={{ marginBottom: '10px', display: 'flex', marginTop: '10px' }}>

                                        <input type="checkbox" value='tuananh' onChange={handleCheckboxChange} style={{ marginRight: '5px' }} /> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png" alt="Flag of Vietnam" width="30px" height="30px" style={{ borderRadius: '50%', padding: '0 10px' }} />TUAN ANH
                                    </div>
                                    <div className='dladd' style={{ marginBottom: '10px', display: 'flex', marginTop: '10px' }}>
                                        <input type="checkbox" value='bao' onChange={handleCheckboxChange} style={{ marginRight: '5px' }} /><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1280px-Flag_of_Vietnam.svg.png" alt="Flag of Vietnam" width="30px" height="30px" style={{ borderRadius: '50%', padding: '0 10px' }} /> BAO
                                    </div>

                                </div>
                                <div className='ctaddG2' style={{ flex: 1, paddingLeft: '20px', overflowY: 'scroll', scrollbarWidth: 'auto', height: '250px' }}>
                                    <div style={{ marginBottom: '10px' }}>
                                        <span style={{ fontSize: '18px', color: '#555', fontWeight: 'bold' }}>Đã chọn {selectedItems.length}/100</span>
                                    </div>
                                    <ul style={{ padding: 0, margin: 0 }}>
                                        {selectedItems.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className='endAddG' style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <button onClick={handleButtonDeG} style={{ backgroundColor: '#ccc', color: '#333', padding: '12px 40px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginRight: '10px', transition: 'background-color 0.3s' }}>Cancel</button>
                                <input type="submit" value="Create" className='timKiem' style={{ backgroundColor: 'rgb(240, 143, 23)', color: '#fff', padding: '12px 40px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'background-color 0.3s' }} />
                            </div>
                        </form>
                    </div>
                    {/* doi het cai form nay */}
                    {/* <div id='myFormTT' ref={formRefTT}>
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
                    </div> */}
                    <div id='myFormTT' ref={formRefTT} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'none', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                        <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)', padding: '20px', width: '400px' }}>
                            <h3 style={{ fontSize: '24px', marginBottom: '20px', position: 'relative' }}>
                                Personal Information
                                <button className='btn-off' onClick={handleButtonDeTT} style={{ position: 'absolute', top: '5px', right: '5px', border: 'none', background: 'none', cursor: 'pointer' }}>
                                    <i className='bx bx-x' style={{ fontSize: '24px', color: '#333' }}></i>
                                </button>
                            </h3>
                            <img src={user.background} alt="" style={{ width: '400px', height: '140px', borderRadius: '8px', marginBottom: '20px' }} />
                            <div className='image-name' style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <img src={user.avatar} alt="" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #333', marginRight: '20px' }} />
                                <span id='name' style={{ fontSize: '20px', fontWeight: 'bold' }}>{user.fullName}</span>
                            </div>
                            <div className='infor'>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Gender:</label>
                                    <span id='gender' style={{ marginLeft: '10px' }}>{user.gender}</span>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Date of Birth:</label>
                                    <span id='birthday' style={{ marginLeft: '10px' }}>{user.dateOfBirth}</span>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Email:</label>
                                    <span id='email' style={{ marginLeft: '10px' }}>{user.email}</span>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Phone Number:</label>
                                    <span id='phone' style={{ marginLeft: '10px' }}>{user.phoneNumber}</span>
                                </div>
                            </div>
                            <button onClick={handleUpdateUser} className='btn-update-infor' style={{ backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}>Update</button>
                        </div>
                    </div>
                    <div className='list-tt'>
                        {SearchRooms.map(room => (
                            <Item key={room._id} link={getDisplayUser(room).avatar} delele={room._id} name={getDisplayUser(room).fullName} tt={getDisplayAuthor(room)} action={getDisplayLastMessages(room)} time={'3gio'} onClick={() => {
                                setFriend(room.friend)
                                setHomemess(room._id);
                                setAvatar(getDisplayUser(room).avatar);
                                setNameRoom(getDisplayUser(room).fullName)
                                setGender(getDisplayUser(room).gender)
                                setEmail(getDisplayUser(room).email)
                                setSdt(getDisplayUser(room).phoneNumber)
                                setDateBirth(getDisplayUser(room).dateOfBirth)
                            }} />

                        ))}
                    </div>

                </div>
                <Mess id={homemess} nameRoom={nameRoom} avatar={avatar} updateLastMessage={updateLastMessage} gender={gender} email={email} sdt={sdt} dateBirth={dateBirth} friend={friend}  />
            </div>
        </div>
    )
}