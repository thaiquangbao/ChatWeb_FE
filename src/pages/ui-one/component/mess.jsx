import React, { useState, useContext, useEffect, useRef}  from 'react'
import { getRoomsMessages, createMessage } from '../../../untills/api';
import { AuthContext } from '../../../untills/context/AuthContext'
import { SocketContext } from '../../../untills/context/SocketContext';
export const Mess = ({ id, nameRoom, avatar, updateLastMessage }) => {
    const [messages, setMessages] = useState([]);
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [texting, setTexting] = useState('');
    const thuNhoBaRef = useRef();
    const thuNhoBonRef = useRef();
    const timeChat = (dataTime) => {
        const time = dataTime.substring(11, 16);
        return time;
    }
    useEffect(() => {
        const RoomMessages = {
            roomsId: id
        }
        getRoomsMessages(RoomMessages)
        .then((data) => {
            setMessages(data.data);
        })
        .catch((err) => {
            console.log(err);
        })
    },[id])
    useEffect(() => {
        socket.on('connected', () => console.log('Connected'));
        socket.on(id, messagesSocket => {
            setMessages(prevMessages => [...prevMessages, messagesSocket.message]);
            updateLastMessage(messagesSocket.rooms)
        })
       
        socket.emit('onUserTyping', {roomsId: id})
        return () => {
            socket.off('connected');
            socket.off(id)
        }
    },[id]);
    const messRef = useRef();
    const ScrollbarCuoi = () => {
        const scroll = messRef.current;
        if (scroll) {
            scroll.scrollTop = scroll.scrollHeight;
        }
    };
    useEffect(() => {
        ScrollbarCuoi();
    });
    const handleButtonClick = () => {
        if (thuNhoBaRef.current.style.width === '100%') {
            thuNhoBaRef.current.style.width = '64%';
            thuNhoBonRef.current.style.width = '36%';
        }
        else {
            thuNhoBaRef.current.style.width = '100%';
            thuNhoBonRef.current.style.width = '0';
        }

    }
    const handleTexting = (e) => {
        console.log(e);
        // Thêm logic xử lý gửi tin nhắn tới server hoặc thực hiện các hành động khác ở đây
    };

    const handleChange = (e) => {
        const newTexting = e.target.value;
        setTexting(newTexting);
        handleTexting(newTexting);
    };
    const handleSendMess = () => {
        if (texting === '') {
            alert("Mời bạn nhập tin nhắn");
            return;
        }
        else if(!id) {
            alert("Không tìm thấy Phòng bạn muốn gửi tin nhắn");
            return;
        }
        else{
            const data = {
                content: texting,
                roomsID: id,
            };
            createMessage(data)
            .then((res) => {
                setTexting("");
                // console.log(res.data.rooms);
            })
            .catch((err) => {
                console.log(err);
            })
        }

        
    }
    const sendTypingStatus = () => {
        console.log("Typing test");
        
    }
    return (
        <div className='baoquat'>
            <div className='section-three' ref={thuNhoBaRef}>
                <div className='title' >
                    <div className='title-tt'>
                        <img src={avatar} alt="" style={{ width: '50px', borderRadius: "50px", marginLeft: "5px" }} />
                        <div className='inf-title'>
                            <span className='name-title'>{nameRoom}</span>
                            <div className='member'>
                                <i className='bx bxs-group' ></i>
                            </div>
                        </div>
                    </div>
                    <div className='icon'>
                        <i className='bx bx-user-plus' ></i>
                        <i className='bx bx-search-alt-2' ></i>
                        <i className='bx bx-camera-movie' onClick={handleButtonClick} style={{ cursor: 'pointer' }}></i>
                    </div>
                </div>

                <div className='inf-mess' ref={messRef}>
                    {messages.map((m) => (
                        <div key={m._id} className={`m ${m.author.email === user.email ? 'mess-me' : 'mess-you'}`}>
                            <img src={m.author.avatar} alt="" style={{ width: '50px', borderRadius: "50px" }} />
                            <div className='inf-you'>
                                <div className='tt'>
                                    <span>{m.author.fullName}</span>
                                    <span>{timeChat(m.createdAt)}</span>
                                </div>
                                <div className='content'>
                                    <p>{m.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* <div className='mess-me'>
                        <img src='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' alt="" style={{ width: '50px', borderRadius: "50px" }} />
                        <div className='inf-you'>
                            <div className='tt'>
                                <span>Tuan Anh</span>
                                <span>10h19</span>
                            </div>
                            <div className='content'>
                                <p>con gà</p>
                            </div>
                        </div>
                    </div> */}
                <div style={{ position: "absolute", bottom: "110px" }}>Is typing...</div>
                </div>
                
                <div className='soan'>
                
                    <div className='nd'>
                        
                        <input
                            type="text"
                            placeholder='Type a message here..'
                            value={texting}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                sendTypingStatus();
                            }}
                        />
                    </div>
                    <div className='cachthuc'>
                        <i className='bx bx-smile'></i>
                        <i className='bx bx-image-alt' ></i>
                        <i className='bx bx-link-alt' ></i>
                        <i onClick={handleSendMess} className='bx bxs-send'></i>
                    </div>

                </div>

            </div>
            <div className='section-four' ref={thuNhoBonRef}>
                <div className='title'>
                    <h3>Thông tin</h3>
                </div>
                {/* them cai div section-four-cro bao het cac cai kia */}
                <div className='section-four-cro'>
                    <div className='avt'>
                        <img src="https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain" alt="" style={{ width: '70px', borderRadius: "50px" }} />
                    </div>
                    <div className='inf'>
                        <p>Tuấn Anh</p>
                        <i className='bx bx-edit-alt'></i>
                    </div>
                    <div className='thaotac'>
                        <div className='thaotac-one'>
                            <i className='bx bx-bell'></i>

                        </div>
                        <div className='thaotac-one'>
                            <i className='bx bx-group'></i>

                        </div>
                        <div className='thaotac-one'>
                            <i className='bx bxs-coffee-togo'></i>

                        </div>
                    </div>
                    <div className='thaotac'>
                        <div className='thaotac-two'>

                            <span>Tắt thông báo</span>
                        </div>
                        <div className='thaotac-two'>

                            <span>Thêm thành viên </span>
                        </div>
                        <div className='thaotac-two'>

                            <span>Xóa trò chuyện</span>
                        </div>
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
                    </div>
                    <div className='file'>
                        <div className='title-file'>
                            <span>File</span>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

