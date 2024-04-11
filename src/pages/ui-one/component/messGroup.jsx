import React, { useState, useContext, useEffect, useRef } from 'react'
import { getGroupsMessages } from '../../../untills/api';
import { AuthContext } from '../../../untills/context/AuthContext'
import { SocketContext } from '../../../untills/context/SocketContext';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const MessGroup = ({ group }) => {

    const [messagesGroups, setMessagesGroups] = useState([]);
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [texting, setTexting] = useState('');
    // const [showHover, setShowHover] = useState(false); // State để điều khiển việc hiển thị hover
    const [submitClicked, setSubmitClicked] = useState(false); // State để theo dõi trạng thái của nút "Submit"
    const [recalledMessages, setRecalledMessages] = useState([]);

    const [areFriends, setAreFriends] = useState(false);
    const [displayMode, setDisplayMode] = useState('none');
    const [sendFile, setSendFile] = useState([])
    const [sendImage, setSendImage] = useState([])
    const [editedMessage, setEditedMessage] = useState('');
    const [changeText, setChangeText] = useState(null)
    const [clickedMessage, setClickedMessage] = useState(null);
    const [hoveredMessage, setHoveredMessage] = useState(null);
    const [showIcons, setShowIcons] = useState(false);

    //cảm giác nút bấm
    const [isActive, setIsActive] = useState(false);

    const thuNhoBaRef = useRef();
    const thuNhoBonRef = useRef();
    const timeChat = (dataTime) => {
        const time = dataTime.substring(11, 16);
        return time;
    }
    useEffect(() => {
        
        if (group === undefined) {
            return;
        }
       
        const GroupMessages = {
            groupId: group._id
        }
        getGroupsMessages(GroupMessages)
            .then((data) => {
                console.log(data.data);
                setMessagesGroups(data.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [group])
    const setTingNameGroups = (group) => {
        if (group.nameGroups === '') {
            return `Groups của ${group.creator.fullName}`
        } else {
            return group.nameGroups;
        }
    }
    const messRef = useRef();
    const ScrollbarCuoi = () => {
        const scroll = messRef.current;
        if (scroll) {
            scroll.scrollTop = scroll.scrollHeight;
        }
    };
    useEffect(() => {
        setTimeout(() => {
            ScrollbarCuoi();
        }, 500)

    }, [messagesGroups]);
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
    // const handleSendMess = () => {
    //     if (texting === '') {
    //         alert("Mời bạn nhập tin nhắn");
    //         return;
    //     }
    //     else if (!id) {
    //         alert("Không tìm thấy Phòng bạn muốn gửi tin nhắn");
    //         return;
    //     }
    //     else {

    //         setIsActive(true); // Kích hoạt hiệu ứng khi nút được click
    //         if (sendFile.length > 0) {
    //             const formData = new FormData();
    //             formData.append('file', sendFile[0]);
    //             createMessagesFile(formData)
    //                 .then((resFile) => {
    //                     const data1 = {
    //                         content: resFile.data,
    //                         roomsID: id,
    //                     };
    //                     createMessage(data1)
    //                         .then((res) => {
    //                             setTexting("");
    //                             setSendFile([]);
    //                             ScrollbarCuoi();
    //                             if (res.data.status === 400) {
    //                                 alert("Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau")
    //                                 window.location.reload();
    //                             }
    //                             setTimeout(() => {
    //                                 setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
    //                             }, 300);
    //                             //console.log(res.data);
    //                         })
    //                         .catch((err) => {
    //                             if (err.status === 400) {
    //                                 alert("Lỗi Server")
    //                                 window.location.reload();
    //                             }


    //                         })
    //                 })
    //                 .catch((err) => {
    //                     console.log(err);
    //                 })

    //         }
    //         else if (sendImage.length > 0) {
    //             const formData1 = new FormData();
    //             formData1.append('file', sendImage[0]);
    //             createMessagesFile(formData1)
    //                 .then((resFile) => {
    //                     const data2 = {
    //                         content: resFile.data,
    //                         roomsID: id,
    //                     };
    //                     createMessage(data2)
    //                         .then((res) => {
    //                             setTexting("");
    //                             setSendImage([]);
    //                             if (res.data.status === 400) {
    //                                 alert("Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau")
    //                                 window.location.reload();
    //                             }
    //                             setTimeout(() => {
    //                                 setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
    //                             }, 300);
    //                             //console.log(res.data);
    //                         })
    //                         .catch((err) => {
    //                             if (err.status === 400) {
    //                                 alert("Lỗi Server")
    //                                 window.location.reload();
    //                             }


    //                         })
    //                 })
    //                 .catch((err) => {
    //                     console.log(err);
    //                 })

    //         }
    //         else {
    //             const data = {
    //                 content: texting,
    //                 roomsID: id,
    //             };
    //             createMessage(data)
    //                 .then((res) => {
    //                     setTexting("");
    //                     if (res.data.status === 400) {
    //                         alert("Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau")
    //                         window.location.reload();
    //                     }
    //                     setTimeout(() => {
    //                         setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
    //                     }, 300);
    //                     //console.log(res.data);
    //                 })
    //                 .catch((err) => {
    //                     if (err.status === 400) {
    //                         alert("Lỗi Server")
    //                         window.location.reload();
    //                     }


    //                 })
    //         }
    //     }


    // }


    let settime = null;

    useEffect(() => {

        clearTimeout(settime);



    }, [texting]);

    // const handleKeyDown = (e) => {
    //     socket.emit(`onUserTyping`, { roomsId: id, phoneNumber: user.phoneNumber })
    // };
    const [like, setLike] = useState(null);
    const handleMouseEnter = (messageId) => {
        setHoveredMessage(messageId);
        setLike(messageId)
    };
    const handleMouseLeave = () => {
        setHoveredMessage(null);
        setChangeText(null)
        setLike(null)
    };


    const handleThreeClick = (messageId) => {
        setHoveredMessage(null);
        setClickedMessage(messageId);
    }

    // const handleDelete = (messageId) => {
    //     const idLastMess = messages.slice(-1)[0]
    //     const dataDeleteMessages = {
    //         idMessages: messageId,
    //         idLastMessageSent: idLastMess._id,
    //         email: user.email
    //     }
    //     deleteMessages(id, dataDeleteMessages)
    //         .then((res) => {
    //             if (res.data.response === "Bạn không phải là chủ tin nhắn") {
    //                 alert("Bạn không phải chủ tin nhắn nên không thể xóa")
    //             }
    //             if (res.status !== 200) {
    //                 alert("Không thể xóa được tin nhắn")
    //                 return;
    //             }
    //         })
    //         .catch((err) => {
    //             alert("Lỗi hệ thống")
    //         })
    // };


    const messageRemoved = (content) => {
        if (content === "") {
            return "Tin nhắn đã được thu hồi"
        }
        else {
            return content;
        }
    }



    const handleUndo = (messageId) => {
        setClickedMessage(null)
        setChangeText(messageId)
        const messageToEdit = messagesGroups.find(message => message._id === messageId);
        setEditedMessage(messageToEdit.content);
        setSubmitClicked(false);


    };
    const handleChangeText = (e) => {

        setEditedMessage(e.target.value);
    };
    // Hàm xử lý khi nhấn nút "Submit"
    // const changeTextButton = (messageId) => {

    //     // Nếu ô input không rỗng, thực hiện cập nhật tin nhắn
    //     const idLastMess = messages.slice(-1)[0];
    //     const dataUpdateMessage = {
    //         newMessages: editedMessage,
    //         idMessages: messageId,
    //         idLastMessageSent: idLastMess._id,
    //         email: user.email,
    //     };
    //     updateMessage(id, dataUpdateMessage)
    //         .then(res => {
    //             if (res.data.response === "Bạn không phải là chủ tin nhắn") {
    //                 alert("Bạn không phải là chủ tin nhắn nên không thể cập nhật");
    //                 return;
    //             }
    //             if (res.status !== 200) {
    //                 alert("Không thể cập nhật được tin nhắn")
    //                 return;
    //             }
    //             // Cập nhật trạng thái của hoveredMessage và changeText
    //             setHoveredMessage(null);
    //             setChangeText(null);
    //         })
    //         .catch(err => {
    //             alert("Lỗi hệ thống")
    //         });

    //     // Đặt các biến state khác như trước
    // };



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
        const files = event.target.files;
        setSendFile(files);
    };
    const handleFileChangeImage = (event) => {
        const file = event.target.files[0];
        if (file) {

            setTexting(file.name);
        }
        const files = event.target.files;
        setSendImage(files);
    };


    const handleSendIcon = (icon) => {
        setTexting(prev => prev + icon);
        // setShowIcons(false); // Ẩn danh sách biểu tượng sau khi chọn
    };

    // const handleSendIconMess = (icon, messageId) => {
    //     //xu ly o day
    //     setShowIcons(false);
    //     const idLastMess = messages.slice(-1)[0];
    //     const dataUpdateEmoji = {
    //         newEmoji: icon,
    //         idMessages: messageId,
    //         idLastMessageSent: idLastMess._id,
    //         email: user.email,
    //     };

    //     updateEmoji(id, dataUpdateEmoji)
    //         .then((res) => {
    //             console.log(res.data);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         })
    // };
    const [showIconsMess, setShowIconsMess] = useState(null);
    const iconsmess = ['👍', '❤️', '😄', '😍', '😞', '😠'];
    const [hoveredIcon, setHoveredIcon] = useState(null);
    const handleIconHover = (icon) => {
        setHoveredIcon(icon);
    };
    const handleIconLeave = () => {
        setHoveredIcon(null);
    };

    const iconsRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (iconsRef.current && !iconsRef.current.contains(e.target)) {
                setShowIcons(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {

            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [iconsRef]);
     const [leader, setLeader] = useState(false)
    const handleExitRom = () => {

    }
    const handleDissolution = () => {

    }
    return (
        <div className='baoquat'>
            {group !== undefined ? (
            <div className='baoqua'>
                <div className='section-three' ref={thuNhoBaRef}>
                    <div className='title' >
                        <div className='title-tt'>
                            <div style={{ position: 'relative', width: '50px', height: '50px', marginLeft: "5px" }}>
                                <div>
                                    <img src={group.participants[0].avatar} alt="" style={{ width: '30px', height: "30px", borderRadius: '50%', position: 'absolute', right: '0', top: '0' }} />
                                    <img src={group.participants[0].avatar} alt="" style={{ width: '30px', height: "30px", borderRadius: '50%', position: 'absolute', left: '0', top: '0' }} />
                                </div>
                                <div>
                                    <img src={group.participants[0].avatar} alt="" style={{ width: '30px', height: "30px", borderRadius: '50%', position: 'absolute', bottom: '0', transform: 'translateX(35%)' }} />

                                </div>
                            </div>
                            {/* <img src={'https://th.bing.com/th/id/OIP.avb9nDfw3kq7NOoP0grM4wHaEK?rs=1&pid=ImgDetMain'} alt="" style={{ width: '50px', borderRadius: "50px", marginLeft: "5px" }} /> */}
                            <div className='inf-title'>
                                <span className='name-title'>{setTingNameGroups(group)}</span> {/*  */}
                                <div className='member'>

                                    <i className='bx bxs-group'>{group.participants.length} member</i>

                                </div>
                            </div>
                        </div>
                        <div className='icon'>
                            <i className='bx bx-user-plus' ></i>
                            <i className='bx bx-camera-movie' ></i>
                            <i className='bx bx-menu' onClick={handleButtonClick} style={{ cursor: 'pointer' }}></i>
                        </div>
                    </div>

                    <div className='inf-mess' ref={messRef}>

                        {messagesGroups.map((m) => (
                            <div key={m._id} className={`m ${m.author?.email === user.email ? 'mess-me' : 'mess-you'}`} onMouseLeave={handleMouseLeave} >
                                <img src={m.author.avatar} alt="" style={{ width: '50px', borderRadius: "50px" }} />
                                <div className='inf-you' onMouseEnter={() => handleMouseEnter(m._id)}>
                                    <div className='tt'>
                                        <span>{m.author.fullName}</span>
                                        <span>{timeChat(m.createdAt)}</span>
                                    </div>
                                    <div className='content'>
                                        {SendToMesageImage(messageRemoved(m.content))}
                                        {m.emoji !== "" && (
                                            <div style={{ position: 'absolute', bottom: '0', left: '0', backgroundColor: 'white', padding: '3px', borderRadius: '50%', transform: 'translate(20%,80%)', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                                {m.emoji}
                                            </div>
                                        )}
                                        {/* {like === m._id && (<i style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: 'white', padding: '3px', borderRadius: '50%', transform: 'translate(-50%,80%)', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} className='bx bx-like' onClick={() => setShowIconsMess(m._id)} >{showIconsMess === m._id && (
                                            <div style={{ display: 'flex', position: 'absolute', boxShadow: '0 0 10px rgb(222, 212, 212)', top: '0', left: '0', cursor: 'pointer', transform: 'translate(-59%,-130%)', borderRadius: '5px', backgroundColor: 'white' }}>
                                                {iconsmess.map((icon, index) => (
                                                    <span key={index} style={{
                                                        fontSize: hoveredIcon === icon ? '25px' : '17px',
                                                        transition: 'font-size 0.5s ease', padding: '5px'
                                                    }} onClick={() => handleSendIconMess(icon, m._id)} onMouseEnter={() => handleIconHover(icon)}
                                                        onMouseLeave={handleIconLeave}>{icon}</span>
                                                ))}
                                            </div>
                                        )}</i>)} */}
                                    </div>
                                </div>
                                {/* {hoveredMessage === m._id && !submitClicked && (
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
                                )} */}
                            </div>
                        ))}
                        {isTyping && <div style={{ position: "absolute", bottom: "110px" }}>{user.fullName.slice(-9)} Is Typing...</div>}
                    </div>


                    <div className='soan'>

                        {/* <div className='nd'>

                            <input
                                type="text"
                                placeholder='Type a message here..'
                                value={texting}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div> */}


                        <div className='cachthuc'>
                            <i className='bx bx-smile' style={{ position: 'relative' }} onClick={() => setShowIcons(true)}>{showIcons && (
                                <div ref={iconsRef} style={{ display: 'flex', position: 'absolute', boxShadow: '0 0 10px rgb(222, 212, 212)', top: '0', left: '0', cursor: 'pointer', transform: 'translate(-50%,-103%)', borderRadius: '5px', backgroundColor: 'white' }}>
                                    {/* {icons.map((icon, index) => (
                                <span key={index} style={{
                                    fontSize: hoveredIcon === icon ? '30px' : '20px',
                                    transition: 'font-size 0.5s ease', padding: '5px'
                                }} onClick={() => handleSendIcon(icon)} onMouseEnter={() => handleIconHover(icon)}
                                    onMouseLeave={handleIconLeave}>{icon}</span>
                            ))} */}
                                    <Picker data={data} onEmojiSelect={(e) => {
                                        handleSendIcon(e.native)
                                    }} />
                                </div>
                            )}</i>
                            <i className='bx bx-image-alt' onClick={handleSendImage} ></i>
                            <i className='bx bx-link-alt' onClick={handleSend}></i>
                            {/* <i
                                onClick={handleSendMess}
                                className={`bx bxs-send ${texting === '' ? 'disabled' : ''} ${isActive ? 'active' : ''}`}
                                style={{ cursor: texting === '' ? 'not-allowed' : 'pointer' }}
                            ></i> */}
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
                {/* <div id='myFormInformation' ref={formRefF} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'none', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
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
                </div> */}
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
                            <p>{setTingNameGroups(group)}</p>
                            <i className='bx bx-edit-alt'></i>
                        </div>

                        <div className='thaotac'>
                            <div className='thaotac-one'>
                                <i className='bx bx-bell'></i>
                                <span style={{ fontSize: '11px' }}>Tắt thông báo</span>
                            </div>
                            <div className='thaotac-one'>
                                <i className='bx bx-group'></i>
                                <span style={{ fontSize: '11px' }}>Thêm thành viên </span>
                            </div>
                            <div className='thaotac-one'>
                                <i className='bx bxs-coffee-togo'></i>
                                <span style={{ fontSize: '11px' }}>Xóa trò chuyện</span>
                            </div>
                            {leader && (<div className='thaotac-one'>
                                <i class='bx bx-subdirectory-right' onClick={handleDissolution}></i>
                                <span style={{ fontSize: '11px' }}>Giải tán</span>
                            </div>)}

                        </div>
                        <div className='video'>
                            <div className='title-video'>
                                <span>Video</span>
                                <i className='bx bx-image' ></i>
                            </div>
                            <div className='videos'>
                                <img src={group.participants[0].avatar} alt="" style={{ width: '90%' }} />
                                <img src={group.participants[1].avatar} alt="" style={{ width: '90%' }} />
                                <img src={group.participants[2].avatar} alt="" style={{ width: '90%' }} />
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
          ) : (<div>
        <div style={{ fontSize: '50px', padding: '50px' }}> <span style={{ animation: 'bouncel2 1s' }}>W</span><span style={{ animation: 'bouncel2 1.2s' }}>e</span><span style={{ animation: 'bouncel2 1.4s' }}>l</span><span style={{ animation: 'bouncel2 1.6s' }}>c</span><span style={{ animation: 'bouncel2 1.8s' }}>o</span><span style={{ animation: 'bouncel2 2s' }}>m</span><span style={{ animation: 'bouncel2 2.2s' }}>e</span></div>
        <div style={{ fontSize: '120px', color: ' rgb(240, 143, 23)', paddingLeft: '200px' }}><span style={{ animation: 'bouncel2 2.4s' }}>Z</span><span style={{ animation: 'bouncel2 2.6s' }}>e</span><span style={{ animation: 'bouncel2 2.8s' }}>n</span><span style={{ animation: 'bouncel2 3s' }}>C</span><span style={{ animation: 'bouncel2 3.2s' }}>h</span><span style={{ animation: 'bouncel2 3.4s' }}>a</span><span style={{ animation: 'bouncel2 3.6s' }}>t</span> </div>
        </div>)} 


        </div>
    )
}

export default MessGroup 