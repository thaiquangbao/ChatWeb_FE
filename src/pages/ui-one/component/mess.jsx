import React, { useState, useContext, useEffect, useRef } from 'react'
import { getRoomsMessages, createMessage, deleteMessages, updateMessage } from '../../../untills/api';
import { AuthContext } from '../../../untills/context/AuthContext'
import { SocketContext } from '../../../untills/context/SocketContext';
export const Mess = ({ id, nameRoom, avatar, updateLastMessage, gender, email, sdt, dateBirth, friend, creator, recipient, idAccept, receiver, sender }) => {

    const [messages, setMessages] = useState([]);
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [texting, setTexting] = useState('');
    // const [showHover, setShowHover] = useState(false); // State để điều khiển việc hiển thị hover
    const [submitClicked, setSubmitClicked] = useState(false); // State để theo dõi trạng thái của nút "Submit"
    const [recalledMessages, setRecalledMessages] = useState([]);

    const [areFriends, setAreFriends] = useState(false);
    const [displayMode, setDisplayMode] = useState('none');

    useEffect(() => {
        // Kiểm tra xem cả hai đều là bạn bè hay không
        if (friend === false) {
            setAreFriends(false);
        } else {
            setAreFriends(true);
        }
    }, [friend]);

    useEffect(() => {
        // Xác định trạng thái hiển thị dựa trên các điều kiện
        if (friend === true) {
            setDisplayMode('friend');
        } else if (receiver === false && sender === false) {
            setDisplayMode('sendRequest');
        } else if (recipient === false) {
            setDisplayMode('sentRequest');
        } else {
            setDisplayMode('acceptRequest');
        }
    }, [friend, receiver, sender, recipient]);

    const renderDisplay = () => {
        switch (displayMode) {
            case 'none':
                return null; // Không hiển thị gì cả
            case 'friend':
                return null;
            case 'sendRequest':
                return (
                    <button
                        onClick={handleSendRequest}
                        style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Gửi lời mời kết bạn
                    </button>
                );
            case 'sentRequest':
                return (
                    <span
                        style={{
                            fontSize: '14px',
                            color: '#555',
                            padding: '5px 10px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '5px',
                        }}
                    >
                        Đã gửi lời mời kết bạn tới người dùng này
                    </span>
                );
            case 'acceptRequest':
                return (
                    <button
                        onClick={handleAcceptRequest}
                        style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Chấp nhận lời mời kết bạn
                    </button>
                );
            default:
                return null;
        }
    };


    const handleSendRequest = () => {

        console.log(`Gửi lời mời kb tới id: ${idAccept}`);
    };

    const handleAcceptRequest = () => {
        // Xử lý logic khi nhấp vào nút "Chấp nhận lời mời kết bạn"
        // console.log('Id của người chấp nhận lời mời kết bạn:', idAccept);
        console.log(`Chấp nhận lời mời kết bạn của: ${idAccept}`);
        // Tiếp theo có thể thực hiện các thao tác khác tùy theo yêu cầu của bạn
    };

    //cảm giác nút bấm
    const [isActive, setIsActive] = useState(false);

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
    }, [id])
    useEffect(() => {
        socket.on('connected', () => console.log('Connected'));
        socket.on(id, messagesSocket => {
            setMessages(prevMessages => [...prevMessages, messagesSocket.message]);
            updateLastMessage(messagesSocket.rooms)
        })
        socket.on(`deleteMessage${id}`, (data) => {
            if (data) {

                // Loại bỏ tin nhắn bằng cách filter, không cần gói trong mảng mới
                setMessages(prevMessages => prevMessages.filter(item => item._id !== data.idMessages));
                updateLastMessage(data.roomsUpdate);

                // Sử dụng concat hoặc spread operator để thêm messages mới vào
                //setMessages(prevMessages => [...prevMessages, ...data.roomsUpdate.messages]);
            }
        })
        socket.on(`updatedMessage${id}`, data => {

            if (data) {
                setMessages(data.messagesCN)
                updateLastMessage(data.dataLoading.roomsUpdate)
            }
        })
        return () => {
            socket.off('connected');
            socket.off(id);
            socket.off(`deleteMessage${id}`);
            socket.off(`updatedMessage${id}`)
        }
    }, [id]);

    const messRef = useRef();
    const ScrollbarCuoi = () => {
        const scroll = messRef.current;
        if (scroll) {
            scroll.scrollTop = scroll.scrollHeight;
        }
    };
    useEffect(() => {
        ScrollbarCuoi();
    }, [id, updateLastMessage]);
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
        // console.log(e);
        // Thêm logic xử lý gửi tin nhắn tới server hoặc thực hiện các hành động khác ở đây

    };


    const [isTyping, setIsTyping] = useState(false);
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
        else if (!id) {
            alert("Không tìm thấy Phòng bạn muốn gửi tin nhắn");
            return;
        }
        else {

            setIsActive(true); // Kích hoạt hiệu ứng khi nút được click



            const data = {
                content: texting,
                roomsID: id,
            };
            createMessage(data)
                .then((res) => {
                    setTexting("");
                    setTimeout(() => {
                        setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                    }, 300);

                })
                .catch((err) => {
                    console.log(err);
                })
        }


    }


    let settime = null;

    useEffect(() => {

        clearTimeout(settime);



    }, [texting]);

    const handleKeyDown = (e) => {
        socket.emit(`onUserTyping`, { roomsId: id, phoneNumber: user.phoneNumber })
    };
    useEffect(() => {
        socket.emit("onRoomJoin", { roomsId: id })
        socket.on("userJoin", () => {
            console.log("user đã tham gia");
        })
        socket.on('userLeave', () => {
            console.log("user đã rời phòng");
        })
        socket.on(`${user.phoneNumber}${id}`, () => {
            setIsTyping(true)

            setTimeout(() => setIsTyping(false), 3000);

        })

        return () => {
            socket.emit("onRoomLeave", { roomsId: id })
            socket.off("userJoin")
            socket.off('userLeave')
            socket.off(`${user.phoneNumber}${id}`)
        }
    }, [id, socket])

    const [hoveredMessage, setHoveredMessage] = useState(null);
    const handleMouseEnter = (messageId) => {
        setHoveredMessage(messageId);
    };
    const handleMouseLeave = () => {
        setHoveredMessage(null);
        setChangeText(null)
    };

    const [clickedMessage, setClickedMessage] = useState(null);
    const handleThreeClick = (messageId) => {
        setHoveredMessage(null);
        setClickedMessage(messageId);
    }

    const handleDelete = (messageId) => {
        const idLastMess = messages.slice(-1)[0]
        const dataDeleteMessages = {
            idMessages: messageId,
            idLastMessageSent: idLastMess._id,
            email: user.email
        }
        deleteMessages(id, dataDeleteMessages)
            .then((res) => {
                if (res.data.response === "Bạn không phải là chủ tin nhắn") {
                    alert("Bạn không phải chủ tin nhắn nên không thể xóa")
                }
                if (res.status !== 200) {
                    alert("Không thể xóa được tin nhắn")
                    return;
                }
            })
            .catch((err) => {
                alert("Lỗi hệ thống")
            })
    };


    const messageRemoved = (content) => {
        if (content === "") {
            return "Tin nhắn đã được thu hồi"
        }
        else {
            return content;
        }
    }


    const [editedMessage, setEditedMessage] = useState('');
    const [changeText, setChangeText] = useState(null)
    const handleUndo = (messageId) => {
        setClickedMessage(null)
        setChangeText(messageId)
        const messageToEdit = messages.find(message => message._id === messageId);
        setEditedMessage(messageToEdit.content);
        setSubmitClicked(false);


    };
    const handleChangeText = (e) => {

        setEditedMessage(e.target.value);
    };
    // Hàm xử lý khi nhấn nút "Submit"
    const changeTextButton = (messageId) => {
      
            // Nếu ô input không rỗng, thực hiện cập nhật tin nhắn
            const idLastMess = messages.slice(-1)[0];
            const dataUpdateMessage = {
                newMessages: editedMessage,
                idMessages: messageId,
                idLastMessageSent: idLastMess._id,
                email: user.email,
            };
            updateMessage(id, dataUpdateMessage)
                .then(res => {
                    if (res.data.response === "Bạn không phải là chủ tin nhắn") {
                        alert("Bạn không phải là chủ tin nhắn nên không thể cập nhật");
                        return;
                    }
                    if (res.status !== 200) {
                        alert("Không thể cập nhật được tin nhắn")
                        return;
                    }
                    // Cập nhật trạng thái của hoveredMessage và changeText
                    setHoveredMessage(null);
                    setChangeText(null);
                })
                .catch(err => {
                    alert("Lỗi hệ thống")
                });
      
        // Đặt các biến state khác như trước
    };



    useEffect(() => {
        let timer;
        if (clickedMessage) {
            timer = setTimeout(() => {
                setClickedMessage(null);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [clickedMessage]);
    const SendToMesageImage = (mm) => {
        if (mm.endsWith('.jpg') || mm.endsWith('.png') || mm.endsWith('.jpeg') || mm.endsWith('.gif') || mm.endsWith('.tiff') || mm.endsWith('.jpe') || mm.endsWith('.jxr') || mm.endsWith('.tif') || mm.endsWith('.bmp')) {
            return <img src={mm} style={{ maxWidth: '300px', maxHeight: '300px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img>
        }
        else if (mm.endsWith('.docx')) {
            return <a href={mm}> <img src='https://th.bing.com/th/id/OIP.wXXoI-2mkMaF3nkllBeBngHaHa?rs=1&pid=ImgDetMain' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
        }
        else if (mm.endsWith('.pdf')) {
            return <a href={mm}> <img src='https://th.bing.com/th/id/R.a6b7fec122cb402ce39d631cf74730b9?rik=2%2b0lI34dy%2f%2fUqw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpdf-logo-png-pdf-icon-png-image-with-transparent-background-toppng-840x859.png&ehk=%2b7EAx%2fH1qN3X6H5dYm9qBGAKiqXiHRhEFmrPSIjFK5o%3d&risl=&pid=ImgRaw&r=0' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
        }
        else if (mm.endsWith('.rar')) {
            return <a href={mm}> <img src='https://vsudo.net/blog/wp-content/uploads/2019/05/winrar-768x649.jpg' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
        }
        else if (mm.endsWith('.mp4')) {
            return <video src={mm} style={{ maxWidth: '300px', maxHeight: '300px', display: 'flex', justifyContent: 'center', zIndex: '5' }} onClick={(e) => { e.preventDefault(); e.target.paused ? e.target.play() : e.target.pause(); }} controls></video>

        }
        else {
            return <p>{mm}</p>;
        }
    }
    // const SetFiends = () => {
    //     // if (friend ) {
            
    //     // }
    //     console.log(friend);
    // }
    const formRefF = useRef(null);
    const handleButtonClickF = () => {
        if (formRefF.current.style.display === 'none') {

            formRefF.current.style.display = 'flex';
        } else {

            formRefF.current.style.display = 'none';
        }
    };
    const btnClose = () => {
        formRefF.current.style.display = 'none';
    }
    const fileInputRef = useRef(null);
    const fileInputRefImage = useRef(null);
    const handleSend = () => {

        fileInputRef.current.click();
    };

    const handleSendImage = () => {

        fileInputRefImage.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {

            setTexting(file.name);
        }

    };
    const handleFileChangeImage = (event) => {
        const file = event.target.files[0];
        if (file) {

            setTexting(file.name);
        }

    };
    const [showIcons, setShowIcons] = useState(false);
    const icons = ['😊', '😄', '😁', '😆', '😂', '🤣', '😎', '😍', '🥰', '😘'];

    const handleSendIcon = (icon) => {
        setTexting(icon);
        setShowIcons(false); // Ẩn danh sách biểu tượng sau khi chọn
    };
    return (
        <div className='baoquat'>
            {id !== undefined ? (<div className='baoqua'>
                <div className='section-three' ref={thuNhoBaRef}>
                    <div className='title' >
                        <div className='title-tt'>
                            <img onClick={handleButtonClickF} src={avatar} alt="" style={{ width: '50px', borderRadius: "50px", marginLeft: "5px" }} />
                            <div className='inf-title'>
                                <span className='name-title'>{nameRoom}</span>
                                <div className='member'>
                                {areFriends === true ? (
                                        <i className='bx bxs-group'>Bạn bè</i>
                                    ) : (
                                        <i>Người lạ</i>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='icon'>
                            <i className='bx bx-phone-call'></i>
                            <i className='bx bx-camera-movie' ></i>
                            <i className='bx bx-menu' onClick={handleButtonClick} style={{ cursor: 'pointer' }}></i>
                        </div>
                    </div>
                    <div style={{ display: 'flex', backgroundColor: 'white', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {renderDisplay()}
                        </div>
                    </div>
                    <div className='inf-mess' ref={messRef}>
                        {messages.map((m) => (
                            <div key={m._id} className={`m ${m.author?.email === user.email ? 'mess-me' : 'mess-you'}`} onMouseLeave={handleMouseLeave} >
                                <img src={m.author.avatar} alt="" style={{ width: '50px', borderRadius: "50px" }} />
                                <div className='inf-you' onMouseEnter={() => handleMouseEnter(m._id)}>
                                    <div className='tt'>
                                        <span>{m.author.fullName}</span>
                                        <span>{timeChat(m.createdAt)}</span>
                                    </div>
                                    <div className='content'>
                                        {SendToMesageImage(messageRemoved(m.content))}

                                    </div>
                                </div>
                                {hoveredMessage === m._id && !submitClicked && (
                                    <button style={{ height: '30px', fontWeight: 'bold', margin: '10px', backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', marginTop: '10px' }} onClick={() => handleThreeClick(m._id)}>...</button>
                                )}

                                {clickedMessage === m._id && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                        <button type='submit' style={{ backgroundColor: '#ffcccc', color: '#cc0000', border: '1px solid #cc0000', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', marginBottom: '10px', fontSize: '10px', width: '80px' }} onClick={() => handleDelete(m._id)}>Delete</button>
                                        <button style={{ backgroundColor: '#ccffcc', color: '#006600', border: '1px solid #006600', borderRadius: '5px', padding: '5px 5px', cursor: 'pointer', fontSize: '10px', width: '80px' }} onClick={() => handleUndo(m._id)} >Edit</button>
                                    </div>
                                )}
                                {changeText === m._id && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                        <input type="text" style={{ marginBottom: '5px', padding: '8px', border: '1px solid #ccc', borderRadius: '5px', width: '200px' }} placeholder='Please enter ' value={editedMessage} onChange={handleChangeText} />
                                        <button style={{ padding: '8px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => changeTextButton(m._id)} >Submit</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && <div style={{ position: "absolute", bottom: "110px" }}>{user.fullName.slice(-9)} Is Typing...</div>}
                    </div>


                    <div className='soan'>

                        <div className='nd'>

                            <input
                                type="text"
                                placeholder='Type a message here..'
                                value={texting}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        {/* <div className='cachthuc'>
                            <i className='bx bx-smile'></i>
                            <i className='bx bx-image-alt' ></i>
                            <i className='bx bx-link-alt' ></i>
                            <i
                                onClick={handleSendMess}
                                className={`bx bxs-send ${texting === '' ? 'disabled' : ''} ${isActive ? 'active' : ''}`}
                                style={{ cursor: texting === '' ? 'not-allowed' : 'pointer' }}
                            ></i>
                        </div> */}
                        {showIcons && (
                            <div style={{ display: 'flex', position: 'absolute', top: '0', left: '60%' }}>
                                {icons.map((icon, index) => (
                                    <span key={index} onClick={() => handleSendIcon(icon)}>{icon}</span>
                                ))}
                            </div>
                        )}
                        <div className='cachthuc'>
                            <i className='bx bx-smile' onClick={() => setShowIcons(!showIcons)}></i>
                            <i className='bx bx-image-alt' onClick={handleSendImage} ></i>
                            <i className='bx bx-link-alt' onClick={handleSend}></i>
                            <i
                                onClick={handleSendMess}
                                className={`bx bxs-send ${texting === '' ? 'disabled' : ''} ${isActive ? 'active' : ''}`}
                                style={{ cursor: texting === '' ? 'not-allowed' : 'pointer' }}
                            ></i>
                        </div>
                        <input
                            type="file"

                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRefImage} // Gán tham chiếu vào input type="file"
                            onChange={handleFileChangeImage}
                        />
                    </div>

                </div>
                <div id='myFormInformation' ref={formRefF} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'none', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)', padding: '20px', width: '400px' }}>
                        <h3 style={{ fontSize: '24px', marginBottom: '20px', position: 'relative' }}>
                            Personal Information
                            <button className='btn-off' onClick={btnClose} style={{ position: 'absolute', top: '5px', right: '5px', border: 'none', background: 'none', cursor: 'pointer' }}>
                                <i className='bx bx-x' style={{ fontSize: '24px', color: '#333' }}></i>
                            </button>
                        </h3>
                        <img src={user.background} alt="" style={{ width: '400px', height: '140px', borderRadius: '8px', marginBottom: '20px' }} />
                        <div className='image-name' style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <img src={avatar} alt="" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #333', marginRight: '20px' }} />
                            <span id='name' style={{ fontSize: '20px', fontWeight: 'bold' }}>{nameRoom}</span>
                        </div>
                        <div className='infor'>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ fontWeight: 'bold' }}>Gender:</label>
                                <span id='gender' style={{ marginLeft: '10px' }}>{gender}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ fontWeight: 'bold' }}>Date of Birth:</label>
                                <span id='birthday' style={{ marginLeft: '10px' }}>{dateBirth}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ fontWeight: 'bold' }}>Email:</label>
                                <span id='email' style={{ marginLeft: '10px' }}>{email}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ fontWeight: 'bold' }}>Phone Number:</label>
                                <span id='phone' style={{ marginLeft: '10px' }}>{sdt}</span>
                            </div>
                        </div>

                    </div>
                </div>
                <div className='section-four' ref={thuNhoBonRef}>
                    {/* them cai div section-four-cro bao het cac cai kia */}
                    <div className='section-four-cro'>
                        <div className='title'>
                            <h3>Thông tin</h3>
                        </div>
                        <div className='avt'>
                            <img src="https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain" alt="" style={{ width: '70px', borderRadius: "50px" }} />
                        </div>
                        <div className='inf'>
                            <p>{nameRoom}</p>
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
            </div>) : (<div>
                <div style={{ fontSize: '50px', padding: '50px' }}> <span style={{ animation: 'bouncel2 1s' }}>W</span><span style={{ animation: 'bouncel2 1.2s' }}>e</span><span style={{ animation: 'bouncel2 1.4s' }}>l</span><span style={{ animation: 'bouncel2 1.6s' }}>c</span><span style={{ animation: 'bouncel2 1.8s' }}>o</span><span style={{ animation: 'bouncel2 2s' }}>m</span><span style={{ animation: 'bouncel2 2.2s' }}>e</span></div>
                <div style={{ fontSize: '120px', color: ' rgb(240, 143, 23)', paddingLeft: '200px' }}><span style={{ animation: 'bouncel2 2.4s' }}>Z</span><span style={{ animation: 'bouncel2 2.6s' }}>e</span><span style={{ animation: 'bouncel2 2.8s' }}>n</span><span style={{ animation: 'bouncel2 3s' }}>C</span><span style={{ animation: 'bouncel2 3.2s' }}>h</span><span style={{ animation: 'bouncel2 3.4s' }}>a</span><span style={{ animation: 'bouncel2 3.6s' }}>t</span> </div>
            </div>)}


        </div>
    )
}

