import React, { useState, useContext, useEffect, useRef } from 'react'
import { getRoomsMessages, createMessage,cancelCall,createMessagesFile, createMessageFeedBack,deleteMessages, updateMessage, updateEmoji ,acceptFriends } from '../../../untills/api';
import { AuthContext } from '../../../untills/context/AuthContext'
import { SocketContext } from '../../../untills/context/SocketContext';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import ErrorMicroInteraction from './giphy.gif'
import SuccessMicroInteraction from './Success Micro-interaction.gif'
export const Mess = ({ id, nameRoom, avatar, updateLastMessage ,gender, email, sdt, dateBirth,  friend, updateRoomFriend ,recipient, idAccept, receiver, sender, background, roomOne }) => {
    const [loi, setLoi] = useState(false);
    const ModalError = ({ message, onClose }) => (
        <div className="modal-overlay" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <div className="modal" style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '40px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)', animation: 'fadeIn 0.3s forwards', position: 'relative', width: '30%', height: '20%' }}>
                <div className="modal-content" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p>{message}</p>
                    <img src={loi ? SuccessMicroInteraction : ErrorMicroInteraction} alt="" style={{ width: '190px', height: '120px' }} />
                    {loi === false && <button style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'red', fontSize: '24px' }} onClick={onClose}>X</button>}

                </div>
            </div>
        </div>
    );
    const [showErrorModal, setShowErrorModal] = useState(false) // Modal errr
    const [errorMessage, setErrorMessage] = useState(''); // Định nghĩa errorMessage và setErrorMessage
    const handleCloseErrorModal = () => {
        setShowErrorModal(false);

    };
    const [sending, setSending] = useState(false);
    const [statusMessage, setStatusMessage] = useState(false); // True - Đã nhận ; false - Đã đọc
    const [messages, setMessages] = useState([]);
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [texting, setTexting] = useState('');
    const [submitClicked, setSubmitClicked] = useState(false); // State để theo dõi trạng thái của nút "Submit"
    const [recalledMessages, setRecalledMessages] = useState([]);
    const [showFormCall, setShowFormCall] = useState(false);
    const [areFriends, setAreFriends] = useState(false);
    const [displayMode, setDisplayMode] = useState('none');
    const [sendFile, setSendFile] = useState([])
    const [sendImage, setSendImage] = useState([])
    const [editedMessage, setEditedMessage] = useState('');
    const [changeText, setChangeText] = useState(null)
    const [clickedMessage, setClickedMessage] = useState(null);
    const [hoveredMessage, setHoveredMessage] = useState(null);
    const [showIcons, setShowIcons] = useState(false);
    const [userInRooms, setUserInRooms] = useState(true);
    const [isOnline, setIsOnline] = useState(false);
    const [videoCallCam, setVideoCallCam] = useState(false)
    const waitingCallEnd = useRef();
    const waitingCallVideoEnd = useRef();
     //cảm giác nút bấm
     const [isActive, setIsActive] = useState(false);
     const thuNhoBaRef = useRef();
     const thuNhoBonRef = useRef();
     // đọc file
     const formRefF = useRef(null);
     const fileInputRef = useRef(null);
     const fileInputRefImage = useRef(null);
     // set icon
     const [showIconsMess, setShowIconsMess] = useState(null);
     const iconsmess = ['👍', '❤️', '😄', '😍', '😞', '😠'];
     const [hoveredIcon, setHoveredIcon] = useState(null);
     const [selectedImage, setSelectedImage] = useState(null);
     const [like, setLike] = useState(null);
     const [changeAnh, setChangeAnh] = useState(false)
     const [testTrang, setTestTrang] = useState('a')
     const [videoCall, setVideoCall] = useState(false)
    useEffect(() => {
        // Kiểm tra xem cả hai đều là bạn bè hay không
        if (friend === false) {
            setAreFriends(false);
        } else {
            setAreFriends(true);
            setDisplayMode('friend');
        }
        if (roomOne === undefined) {
            return;
        }
        // setRoomCreator(roomOne.creator.online)
        // setRoomRecipient(roomOne.recipient.online)
        // console.log(roomCreator);
        // console.log(roomRecipient);
        if (roomOne.creator.email === user.email) {
            if (roomOne.recipient.online === true) {
                setIsOnline(true)
            } else {
                setIsOnline(false)
            }
        } else {
            if (roomOne.creator.online === true) {
                setIsOnline(true)
            } else {
                setIsOnline(false)
            }
        }
       
      
    }, [friend, roomOne]);

    useEffect(() => {
        // Xác định trạng thái hiển thị dựa trên các điều kiện
        if (friend === true) {
            setDisplayMode('friend');
            setAreFriends(true);
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
                    <>
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
                    {showErrorModal && <ModalError message={errorMessage} onClose={handleCloseErrorModal} />}



                </>
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
        const dataId = {
            id: idAccept,
        }
        const roomId = {
          idRooms: id,
        }
        acceptFriends(dataId.id, roomId)
        .then((res) => {
            if (!res.data) {
                setLoi(false)
                // alert('Đồng ý kết bạn không thành công')
                setErrorMessage('Đồng ý kết bạn không thành công')


                setShowErrorModal(true); // Hiển thị modal error
                setTimeout(() => {
                    setShowErrorModal(false);
                }, 2000);
                return;            
            }
            setLoi(true)
                // alert('Đồng ý kết bạn không thành công')
                setErrorMessage('Bây giờ các bạn đã là bạn bè')
                setShowErrorModal(true); // Hiển thị modal error

                setTimeout(() => {
                    setShowErrorModal(false);
                }, 2000);
        })
        .catch((err) => {
            setErrorMessage('Lỗi hệ thống')
                setShowErrorModal(true); // Hiển thị modal error
                setTimeout(() => {
                    setShowErrorModal(false);
                }, 2000);
        })
    };
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
            updateLastMessage(messagesSocket.rooms);
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
        })// updateRoomFriend(data)
        socket.on(`acceptFriends${id}`, data => {
            if (data) {
                setAreFriends(true);
                setDisplayMode('friend');
                updateRoomFriend(data)
            }
            
        })
        socket.on(`acceptUserFriends${id}`, data => {
            if (data) {
                setAreFriends(true);
                setDisplayMode('friend');
                updateRoomFriend(data)
            }
            
        })
        socket.on(`${user.email}`, data => {
            if (data) {
                updateRoomFriend(data)
            }
        })
        socket.on(`emoji${id}`, data => {
            setMessages(preMessages => {
                return preMessages.map(message => {
                    if (message === undefined || data.messagesUpdate === undefined) {
                        return message;
                    }
                    if (message._id === data.messagesUpdate._id) {

                        return data.messagesUpdate;
                    }
                    return message;
                });
            })
        })
        socket.on(`userOnlineRoom${id}`, (data) => {
            console.log(id);
            if (data) {
                data.map(item => {
                    if (item.creator.email === user.email || item.recipient.email === user.email) {
                        if (item.creator.email === user.email) {
                            if (item.recipient.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        } else {
                            if (item.creator.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        }
                    }
                    return null;
                })
            }
            
        });
        socket.on(`userOfflineRoom${id}`, (data) => {
            if (data) {
                data.map(item => {
                    if (item.creator.email === user.email || item.recipient.email === user.email) {
                        if (item.creator.email === user.email) {
                            if (item.recipient.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        } else {
                            if (item.creator.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        }
                    }
                    return null;
                })
            }
            
        });
        socket.on(`signOutRoom${id}`, (data) => {
            if (data) {
                data.map(item => {
                    if (item.creator.email === user.email || item.recipient.email === user.email) {
                        if (item.creator.email === user.email) {
                            if (item.recipient.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        } else {
                            if (item.creator.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        }
                    }
                    return null;
                })
            }
            
        });
        socket.on(`feedBackRooms${id}`, messagesSocket => {
            setMessages(prevMessages => [...prevMessages, messagesSocket.message]);
            updateLastMessage(messagesSocket.rooms);
        })
        socket.on(`userCallVoice${user.email}`, (data) => {
            if(data.errorStatus) {
                // alert("Hiện tại người dùng không trực tuyến")
                setLoi(false)
                   
                    setErrorMessage('Hiện tại người dùng không trực tuyến')
                    setShowErrorModal(true); // Hiển thị modal error
                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
            } else if(data.error) {
                // alert("Hiện tại người dùng đang có cuộc gọi khác")
                setLoi(false)
                   
                    setErrorMessage('Hiện tại người dùng đang có cuộc gọi khác')
                    setShowErrorModal(true); // Hiển thị modal error
                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
            } else if(data.errorCall)  {
                // alert("Bạn đang có một cuộc gọi khác")
                setLoi(false)
                   
                    setErrorMessage('Bạn đang có một cuộc gọi khác')
                    setShowErrorModal(true); // Hiển thị modal error
                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
            } else {
               
                if(data.userCall.email === user.email) 
                {
                    
                   console.log("Đã nhận 1");
                    setVideoCall(true);
                    waitingCallEnd.current = setTimeout(() => {
                        
                        setVideoCall(false);
                        const dataCancelCall = {
                            recipient: roomOne.recipient,
                            creator: roomOne.creator,
                        }
                        
                        cancelCall(dataCancelCall)
                        .then((res) => {
                            const data1 = {
                                content: `Bạn đã nhỡ cuộc gọi của tôi. ☎️`,
                                roomsID: id,
                            };
                            createMessage(data1)
                            .then((res) => {
                                if (userInRooms === true) {
                                    setStatusMessage(false); // Tin nhắn đến trong phòng, đánh dấu là đã đọc
                                } else {
                                    setStatusMessage(true); // Người dùng rời phòng, đánh dấu là đã nhận
                                }
                                if (res.data.status === 400) {
                                    // alert("Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau")
                                    setErrorMessage('Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau');
                                    setShowErrorModal(true); // Hiển thị modal error
                                    window.location.reload();
                                }
                                setTimeout(() => {
                                    setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                                }, 300);
                                //console.log(res.data);
                            })
                            .catch((err) => {
                                if (err.status === 400) {
                                    // alert("Lỗi Server")
                                    setErrorMessage('Lỗi server.');
                                            setShowErrorModal(true); // Hiển thị modal error
                                    window.location.reload();
                                }
                                
                                
                            })
           
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                    }, 15000);
                } 
            }
            
        })
        socket.on(`userRejectedCallVoiceRecipient${user.email}`, data => {
            clearTimeout(waitingCallEnd.current);
             setVideoCall(false);
                
        })
        socket.on(`userCancelCallVoice${user.email}`, data => {
            if(data.error) {

                // alert("Bạn không gọi cho người này");
                setLoi(false)
                   
                    setErrorMessage('Bạn không gọi cho người này')
                    setShowErrorModal(true); // Hiển thị modal error
                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
            } else {
                clearTimeout(waitingCallEnd.current);
                if(data.userCancel.email === user.email) {
                    setVideoCall(false);
                    const data1 = {
                        content: `Bạn đã nhỡ cuộc gọi của tôi. ☎️`,
                        roomsID: id,
                    };
                    createMessage(data1)
                    .then((res) => {
                        if (userInRooms === true) {
                            setStatusMessage(false); // Tin nhắn đến trong phòng, đánh dấu là đã đọc
                        } else {
                            setStatusMessage(true); // Người dùng rời phòng, đánh dấu là đã nhận
                        }
                        if (res.data.status === 400) {
                            // alert("Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau")
                            setErrorMessage('Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau');
                            setShowErrorModal(true); // Hiển thị modal error
                            window.location.reload();
                        }
                        setTimeout(() => {
                            setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                        }, 300);
                        //console.log(res.data);
                    })
                    .catch((err) => {
                        if (err.status === 400) {
                            // alert("Lỗi Server")
                            setErrorMessage('Lỗi server.');
                                    setShowErrorModal(true); // Hiển thị modal error
                            window.location.reload();
                        }
                        
                        
                    })
                } 
            }
        })
        socket.on(`userAttendCallVoiceRecipient${user.email}`, data => {
            clearTimeout(waitingCallEnd.current);
                setVideoCall(false);
                window.open(`/voice_call/${data.idRooms}/${user.fullName}`)
            
        })
        socket.on(`userOnlineAfterMeetO${id}`, data => {
            console.log(id);
            if (data) {
                data.map(item => {
                    if (item.creator.email === user.email || item.recipient.email === user.email) {
                        if (item.creator.email === user.email) {
                            if (item.recipient.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        } else {
                            if (item.creator.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        }
                    }
                    return null;
                })
            }
        })
        socket.on(`userOnlineAfterMeetT${id}`, data => {
            console.log(id);
            if (data) {
                data.map(item => {
                    if (item.creator.email === user.email || item.recipient.email === user.email) {
                        if (item.creator.email === user.email) {
                            if (item.recipient.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        } else {
                            if (item.creator.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        }
                    }
                    return null;
                })
            }
        })
        socket.on(`userCallVideo${user.email}`, (data) => {
            if(data.errorStatus) {
                // alert("Hiện tại người dùng không trực tuyến")
                setLoi(false)
                   
                    setErrorMessage('Hiện tại người dùng không trực tuyến')
                    setShowErrorModal(true); // Hiển thị modal error
                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
            } else if(data.error) {
                // alert("Hiện tại người dùng đang có cuộc gọi khác")
                setLoi(false)
                   
                    setErrorMessage('Hiện tại người dùng đang có cuộc gọi khác')
                    setShowErrorModal(true); // Hiển thị modal error
                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
            } else if(data.errorCall)  {
                // alert("Bạn đang có một cuộc gọi khác")
                setLoi(false)
                   
                    setErrorMessage('Bạn đang có một cuộc gọi khác')
                    setShowErrorModal(true); // Hiển thị modal error
                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
            } else {
               
                if(data.userCall.email === user.email) 
                {
                    
                    setVideoCallCam(true);
                    waitingCallVideoEnd.current = setTimeout(() => {
                        
                        setVideoCallCam(false);
                        const dataCancelCall = {
                            recipient: roomOne.recipient,
                            creator: roomOne.creator,
                        }
                        
                        cancelCall(dataCancelCall)
                        .then((res) => {
                            const data1 = {
                                content: `Bạn đã nhỡ cuộc gọi video của tôi. 📹`,
                                roomsID: id,
                            };
                            createMessage(data1)
                            .then((res) => {
                                if (userInRooms === true) {
                                    setStatusMessage(false); // Tin nhắn đến trong phòng, đánh dấu là đã đọc
                                } else {
                                    setStatusMessage(true); // Người dùng rời phòng, đánh dấu là đã nhận
                                }
                                if (res.data.status === 400) {
                                    // alert("Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau")
                                    setErrorMessage('Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau');
                                    setShowErrorModal(true); // Hiển thị modal error
                                    window.location.reload();
                                }
                                setTimeout(() => {
                                    setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                                }, 300);
                                //console.log(res.data);
                            })
                            .catch((err) => {
                                if (err.status === 400) {
                                    // alert("Lỗi Server")
                                    setErrorMessage('Lỗi server.');
                                            setShowErrorModal(true); // Hiển thị modal error
                                    window.location.reload();
                                }
                                
                                
                            })
           
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                    }, 15000);
                    
                } 
            }
            
        })
        socket.on(`userCancelVideoCall${user.email}`, data => {
            if(data.error) {
                // alert("Bạn không gọi cho người này");
                setLoi(false)
                   
                    setErrorMessage('Bạn không gọi cho người này')
                    setShowErrorModal(true); // Hiển thị modal error
                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
            } else {
                if(data.userCancel.email === user.email) {
                    clearTimeout(waitingCallVideoEnd.current);
                    setVideoCallCam(false);
                    const data1 = {
                        content: `Bạn đã nhỡ cuộc gọi video của tôi. 📹`,
                        roomsID: id,
                    };
                    createMessage(data1)
                    .then((res) => {
                        if (userInRooms === true) {
                            setStatusMessage(false); // Tin nhắn đến trong phòng, đánh dấu là đã đọc
                        } else {
                            setStatusMessage(true); // Người dùng rời phòng, đánh dấu là đã nhận
                        }
                        if (res.data.status === 400) {
                            // alert("Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau")
                            setErrorMessage('Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau');
                            setShowErrorModal(true); // Hiển thị modal error
                            window.location.reload();
                        }
                        setTimeout(() => {
                            setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                        }, 300);
                        //console.log(res.data);
                    })
                    .catch((err) => {
                        if (err.status === 400) {
                            // alert("Lỗi Server")
                            setErrorMessage('Lỗi server.');
                                    setShowErrorModal(true); // Hiển thị modal error
                            window.location.reload();
                        }
                        
                        
                    })
                } 
            }
        })
        socket.on(`userRejectedCallVideoRecipient${user.email}`, data => {
            clearTimeout(waitingCallVideoEnd.current);
            setVideoCallCam(false);
               
       })
       socket.on(`userAttendCallVideoRecipient${user.email}`, data => {
        clearTimeout(waitingCallVideoEnd.current);
            setVideoCallCam(false);
            window.open(`/video_call/${data.idRooms}/${user.fullName}`)
        })
        socket.on(`userOnlineAfterMeetVideoO${id}`, data => {
            console.log(id);
            if (data) {
                data.map(item => {
                    if (item.creator.email === user.email || item.recipient.email === user.email) {
                        if (item.creator.email === user.email) {
                            if (item.recipient.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        } else {
                            if (item.creator.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        }
                    }
                    return null;
                })
            }
        })
        socket.on(`userOnlineAfterMeetVideoT${id}`, data => {
            console.log(id);
            if (data) {
                data.map(item => {
                    if (item.creator.email === user.email || item.recipient.email === user.email) {
                        if (item.creator.email === user.email) {
                            if (item.recipient.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        } else {
                            if (item.creator.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        }
                    }
                    return null;
                })
            }
        })
        socket.on(`userOnlineAfterMeetGroup${id}`, data => {
            console.log(id);
            if (data) {
                data.map(item => {
                    if (item.creator.email === user.email || item.recipient.email === user.email) {
                        if (item.creator.email === user.email) {
                            if (item.recipient.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        } else {
                            if (item.creator.online === true) {
                                setIsOnline(true)
                            } else {
                                setIsOnline(false)
                            }
                        }
                    }
                    return null;
                })
            }
        })
        return () => {
            socket.off('connected');
            socket.off(id);
            socket.off(`deleteMessage${id}`);
            socket.off(`updatedMessage${id}`);
            socket.off(`acceptFriends${id}`);
            socket.off(`acceptUserFriends${id}`);
            socket.off(`updateSendedFriend${user.email}`)
            // socket.off(`acceptUserFriendsAll${user.email}`)
            socket.off(`emoji${id}`)
            socket.off(`userOnlineRoom${id}`)
            socket.off(`userOfflineRoom${id}`)
            socket.off(`signOutRoom${id}`)
            socket.off(`feedBackRooms${id}`)
            socket.off(`userCallVoice${user.email}`);
            socket.off(`userRejectedCallVoiceRecipient${user.email}`);
            socket.off(`userCancelCallVoice${user.email}`);
            socket.off(`userAttendCallVoiceRecipient${user.email}`)
            socket.off(`userOnlineAfterMeetO${id}`)
            socket.off(`userOnlineAfterMeetT${id}`)
            socket.off(`userCallVideo${user.email}`);
            socket.off(`userCancelVideoCall${user.email}`)
            socket.off(`userRejectedCallVideoRecipient${user.email}`)
            socket.off(`userAttendCallVideoRecipient${user.email}`)
            socket.off(`userOnlineAfterMeetVideoO${id}`)
            socket.off(`userOnlineAfterMeetVideoT${id}`)
            socket.off(`userOnlineAfterMeetGroup${id}`)
        }
    }, [id, socket]);

    const messRef = useRef();
    const ScrollbarCuoi = () => {
        const scroll = messRef.current;
        if (scroll) {
            scroll.scrollTop = scroll.scrollHeight;
        }
    };
    useEffect(() => {
      setTimeout(()=>{
        ScrollbarCuoi();
      },500)
    }, [messages]);
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
            // alert("Mời bạn nhập tin nhắn");
            setErrorMessage('Mời bạn nhập tin nhắn');
            setShowErrorModal(true); // Hiển thị modal error
            setTimeout(() => {
                    setShowErrorModal(false);
                }, 2000);
            return;
        }
        else if (!id) {
            // alert("Không tìm thấy Phòng bạn muốn gửi tin nhắn");
            setErrorMessage('Không tim thấy phòng bạn muốn gửi tin nhắn');
            setShowErrorModal(true); // Hiển thị modal error
            setTimeout(() => {
                setShowErrorModal(false);
            }, 2000);
            return;
        }
        else {
            
            setStatusMessage(true);
            setIsActive(true); // Kích hoạt hiệu ứng khi nút được click
            if (sendFile.length > 0) {
                const formData = new FormData();
                formData.append('file', sendFile[0]);
                createMessagesFile(formData)
                .then((resFile) => {
                    if (clickedMessageFeedBackOb) {
                        const dataFeedBackMessages= {
                            content: resFile.data,
                            idMessages: clickedMessageFeedBackOb._id,
                        };
                        createMessageFeedBack(id,dataFeedBackMessages)
                        .then((res) => {
                            setTexting("");
                            setSendFile([]);
                            setClickedMessageFeedBackOb(undefined)
                            if (userInRooms === true) {
                                setStatusMessage(false); // Tin nhắn đến trong phòng, đánh dấu là đã đọc
                            } else {
                                setStatusMessage(true); // Người dùng rời phòng, đánh dấu là đã nhận
                            }
                            if (res.data.status === 400) {
                                // alert("Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau")
                                setErrorMessage('Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau');
                                setShowErrorModal(true); // Hiển thị modal error
                                window.location.reload();
                            }
                            setTimeout(() => {
                                setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                            }, 300);
                            //console.log(res.data);
                        
                        }).catch((err) => {
                            if (err.status === 400) {
                                // alert("Lỗi Server")
                                setErrorMessage('Lỗi server.');
                                        setShowErrorModal(true); // Hiển thị modal error
                                window.location.reload();
                            }
                        })
                        .finally(() => {
                            // Set sending thành false khi xử lý hoàn tất
                            setSending(false);
                            console.log(sending)
                        });
                    } else {
                        const data1 = {
                            content: resFile.data,
                            roomsID: id,
                        };
                        createMessage(data1)
                        .then((res) => {
                            setTexting("");
                            setSendFile([]);
                            if (userInRooms === true) {
                                setStatusMessage(false); // Tin nhắn đến trong phòng, đánh dấu là đã đọc
                            } else {
                                setStatusMessage(true); // Người dùng rời phòng, đánh dấu là đã nhận
                            }
                            if (res.data.status === 400) {
                                // alert("Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau")
                                setErrorMessage('Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau');
                                setShowErrorModal(true); // Hiển thị modal error
                                window.location.reload();
                            }
                            setTimeout(() => {
                                setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                            }, 300);
                            //console.log(res.data);
                        })
                        .catch((err) => {
                            if (err.status === 400) {
                                // alert("Lỗi Server")
                                setErrorMessage('Lỗi server.');
                                        setShowErrorModal(true); // Hiển thị modal error
                                window.location.reload();
                            }
                            
                            
                        })
                        .finally(() => {
                            // Set sending thành false khi xử lý hoàn tất
                            setSending(false);
                            console.log(sending)
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                
            }
            else if(sendImage.length > 0) {
                const formData1 = new FormData();
                formData1.append('file', sendImage[0]);
                createMessagesFile(formData1)
                .then((resFile) => {
                    if (clickedMessageFeedBackOb) {
                        const dataFeedBackMessages= {
                            content: resFile.data,
                            idMessages: clickedMessageFeedBackOb._id,
                        };
                        createMessageFeedBack(id,dataFeedBackMessages)
                        .then((res) => {
                            setTexting("");
                            setSendFile([]);
                            setClickedMessageFeedBackOb(undefined)
                            if (userInRooms === true) {
                                setStatusMessage(false); // Tin nhắn đến trong phòng, đánh dấu là đã đọc
                            } else {
                                setStatusMessage(true); // Người dùng rời phòng, đánh dấu là đã nhận
                            }
                            if (res.data.status === 400) {
                                // alert("Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau")
                                setErrorMessage('Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau');
                                setShowErrorModal(true); // Hiển thị modal error
                                window.location.reload();
                            }
                            setTimeout(() => {
                                setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                            }, 300);
                            //console.log(res.data);
                        
                        }).catch((err) => {
                            if (err.status === 400) {
                                // alert("Lỗi Server")
                                setErrorMessage('Lỗi server.');
                                        setShowErrorModal(true); // Hiển thị modal error
                                window.location.reload();
                            }
                        })
                    } else { 
                        const data2 = {
                            content: resFile.data,
                            roomsID: id,
                        };
                        createMessage(data2)
                        .then((res) => {
                            setTexting("");
                            setSendImage([]);
                            if (userInRooms === true) {
                                setStatusMessage(false); // Tin nhắn đến trong phòng, đánh dấu là đã đọc
                            } else {
                                setStatusMessage(true); // Người dùng rời phòng, đánh dấu là đã nhận
                            }
                            if (res.data.status === 400) {
                                // alert("Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau")
                                setErrorMessage('Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau');
                                        setShowErrorModal(true); // Hiển thị modal error
                                window.location.reload();
                            }
                            setTimeout(() => {
                                setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                            }, 300);
                            //console.log(res.data);
                        })
                        .catch((err) => {
                            if (err.status === 400) {
                                // alert("Lỗi Server")
                                setErrorMessage('Lỗi server.');
                                        setShowErrorModal(true); // Hiển thị modal error
                                window.location.reload();
                            }
                            
                            
                        })
                    }
                    
                })
                .catch((err) => {
                    console.log(err);
                })
                
            }
            else {
                if (clickedMessageFeedBackOb) {
                    const dataFeedBackMessages= {
                        content: texting,
                        idMessages: clickedMessageFeedBackOb._id,
                    };
                    createMessageFeedBack(id,dataFeedBackMessages)
                    .then((res) => {
                        setTexting("");
                        setSendFile([]);
                        setClickedMessageFeedBackOb(undefined)
                        if (userInRooms === true) {
                            setStatusMessage(false); // Tin nhắn đến trong phòng, đánh dấu là đã đọc
                        } else {
                            setStatusMessage(true); // Người dùng rời phòng, đánh dấu là đã nhận
                        }
                        if (res.data.status === 400) {
                            // alert("Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau")
                            setErrorMessage('Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau');
                            setShowErrorModal(true); // Hiển thị modal error
                            window.location.reload();
                        }
                        setTimeout(() => {
                            setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                        }, 300);
                        //console.log(res.data);
                    
                    }).catch((err) => {
                        if (err.status === 400) {
                            // alert("Lỗi Server")
                            setErrorMessage('Lỗi server.');
                                    setShowErrorModal(true); // Hiển thị modal error
                            window.location.reload();
                        }
                    })
                } else {
                    const data = {
                        content: texting,
                        roomsID: id,
                    };
                    createMessage(data)
                    .then((res) => {
                        setTexting("");
                        if (userInRooms === true) {
                            setStatusMessage(false); // Tin nhắn đến trong phòng, đánh dấu là đã đọc
                        } else {
                            setStatusMessage(true); // Người dùng rời phòng, đánh dấu là đã nhận
                        }
                        if (res.data.status === 400) {
                            // alert("Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau")
                            setErrorMessage('Hiện tại bạn và người này không còn là bạn nên không thể nhắn tin với nhau');
                            setShowErrorModal(true); // Hiển thị modal error
                            window.location.reload();
                        }
                        setTimeout(() => {
                            setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                        }, 300);
                        //console.log(res.data);
                    })
                    .catch((err) => {
                        if (err.status === 400) {
                            // alert("Lỗi Server")
                            setErrorMessage('Lỗi server.');
                                setShowErrorModal(true); // Hiển thị modal error
                            window.location.reload();
                        }
                        
                        
                    })
                }
            }
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
        socket.on(`userJoin${id}`, () => {
            console.log("Người dùng đã tham gia");
            setUserInRooms(true); // Đặt userInRooms thành true khi có người tham gia vào phòng
            setStatusMessage(false); // Reset status khi có người tham gia
        });
        socket.on(`userLeave${id}`, () => {
            console.log("Người dùng đã rời phòng");
            setUserInRooms(false); // Đặt userInRooms thành false khi có người rời phòng
             // Đánh dấu tin nhắn là đã nhận khi có người rời phòng
        });
        socket.on(`${user.phoneNumber}${id}`, () => {
            setIsTyping(true)

            setTimeout(() => setIsTyping(false), 3000);

        })

        return () => {
            socket.emit("onRoomLeave", { roomsId: id })
            socket.off(`userJoin${id}`)
            socket.off(`userLeave${id}`)
            socket.off(`${user.phoneNumber}${id}`)
        }
    }, [id, socket])
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
                    setLoi(false);
                    setErrorMessage('Bạn không phải chủ tin nhắn nên không thể xóa.');
                    setShowErrorModal(true); // Hiển thị modal error
                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
                }
                if (res.status !== 200) {
                    // alert("Không thể xóa được tin nhắn")
                    setLoi(false);

                    setErrorMessage('Không thể xoá được tin nhắn.');
                    setShowErrorModal(true); // Hiển thị modal error
                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
                    return;
                }
            })
            .catch((err) => {
                // alert("Lỗi hệ thống")
                setLoi(false);

                setErrorMessage('Lỗi hệ thống');
                setShowErrorModal(true); // Hiển thị modal error
                setTimeout(() => {
                    setShowErrorModal(false);
                }, 2000);
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
    const handleUndo = (messageId, content) => {
        // setClickedMessage(null)
        // setChangeText(messageId)
        // const messageToEdit = messages.find(message => message._id === messageId);
        // setEditedMessage(messageToEdit.content);
        if (content === "") {
            // alert("không thể thu hồi tin nhắn")
            setLoi(false)
                   
                    setErrorMessage('không thể thu hồi tin nhắn')
                    setShowErrorModal(true); // Hiển thị modal error
                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
            
        }
        const idLastMess = messages.slice(-1)[0];
            const dataUpdateMessage = {
                newMessages: '',
                idMessages: messageId,
                idLastMessageSent: idLastMess._id,
                email: user.email,
            };
            updateMessage(id, dataUpdateMessage)
                .then(res => {
                    if (res.data.response === "Bạn không phải là chủ tin nhắn") {
                        // alert("Bạn không phải là chủ tin nhắn nên không thể cập nhật");
                        setLoi(false);
                        setErrorMessage("Bạn không phải là chủ tin nhắn nên không thể cập nhật");
                    setShowErrorModal(true); // Hiển thị modal error
                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
                        return;
                    }
                    if (res.status !== 200) {
                        // alert("Không thể cập nhật được tin nhắn")
                        setLoi(false);
                        setErrorMessage("Không thể cập nhật được tin nhắn");
                        setShowErrorModal(true); // Hiển thị modal error
                        setTimeout(() => {
                            setShowErrorModal(false);
                        }, 2000);
                        return;
                    }
                    // Cập nhật trạng thái của hoveredMessage và changeText
                    setHoveredMessage(null);
                    setChangeText(null);
                })
                .catch(err => {
                    // alert("Lỗi hệ thống")
                    setLoi(false);
                    setErrorMessage("Lỗi hệ thống");
                setShowErrorModal(true); // Hiển thị modal error
                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
                });
                setSubmitClicked(false);
    };
    const handleChangeText = (e) => {
        setEditedMessage(e.target.value);
    };
    // Hàm xử lý khi nhấn nút "Submit"
    const changeTextButton = (messageId) => {
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
    const SendToMesageImage = (mm, idM) => {
        if (mm.endsWith('.jpg') || mm.endsWith('.png') || mm.endsWith('.jpeg') || mm.endsWith('.gif') || mm.endsWith('.tiff') || mm.endsWith('.jpe') || mm.endsWith('.jxr') || mm.endsWith('.tif') || mm.endsWith('.bmp')) {
            return <img src={mm} key={idM} style={{ maxWidth: '300px', maxHeight: '300px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img>
        }
        else if (mm.endsWith('.docx')) {
            return <a href={mm} key={idM}>  <img src='https://th.bing.com/th/id/OIP.wXXoI-2mkMaF3nkllBeBngHaHa?rs=1&pid=ImgDetMain' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
        }
        else if (mm.endsWith('.pdf')) {
            return <a href={mm} key={idM}> key={id} <img src='https://th.bing.com/th/id/R.a6b7fec122cb402ce39d631cf74730b9?rik=2%2b0lI34dy%2f%2fUqw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpdf-logo-png-pdf-icon-png-image-with-transparent-background-toppng-840x859.png&ehk=%2b7EAx%2fH1qN3X6H5dYm9qBGAKiqXiHRhEFmrPSIjFK5o%3d&risl=&pid=ImgRaw&r=0' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
        }
        else if (mm.endsWith('.rar')) {
            return <a href={mm} key={idM}> <img src='https://vsudo.net/blog/wp-content/uploads/2019/05/winrar-768x649.jpg' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
        }
        else if (mm.endsWith('.mp4')) {
            return <video src={mm} key={idM} style={{ maxWidth: '300px', maxHeight: '300px', display: 'flex', justifyContent: 'center', zIndex: '5' }} onClick={(e) => { e.preventDefault(); e.target.paused ? e.target.play() : e.target.pause(); }} controls></video>

        }
        else if (mm.endsWith('.xlsx')) {
            return <a href={mm} key={idM}> <img src='https://tse2.mm.bing.net/th?id=OIP.U0CtQVB5bE_YEsKgokMH4QHaHa&pid=Api&P=0&h=180' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
        }
        else if (mm.endsWith('.txt')) {
            return <a href={mm} key={idM}> <img src='https://tse4.mm.bing.net/th?id=OIP.kf6nbMokM5UoF7IzTY1C5gHaHa&pid=Api&P=0&h=180' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
        }
        else if (mm.startsWith('https:')) {
            return <a href={mm} key={idM}><p> {mm}</p></a>
        }
        else {
            return <p key={idM}>{mm}</p>;
        }
    }
    const handleButtonClickF = () => {
        if (formRefF.current.style.display === 'none') {

            formRefF.current.style.display = 'flex';
        } else {

            formRefF.current.style.display = 'none';
        }
    };
    const fileMessages = (mm) => {
        if (mm.endsWith('.docx')) {
            return <a href={mm}> <img src='https://th.bing.com/th/id/OIP.wXXoI-2mkMaF3nkllBeBngHaHa?rs=1&pid=ImgDetMain' style={{ maxWidth: '100px', maxHeight: '100px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
        }
        else if (mm.endsWith('.pdf')) {
            return <a href={mm}> <img src='https://th.bing.com/th/id/R.a6b7fec122cb402ce39d631cf74730b9?rik=2%2b0lI34dy%2f%2fUqw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpdf-logo-png-pdf-icon-png-image-with-transparent-background-toppng-840x859.png&ehk=%2b7EAx%2fH1qN3X6H5dYm9qBGAKiqXiHRhEFmrPSIjFK5o%3d&risl=&pid=ImgRaw&r=0' style={{ maxWidth: '100px', maxHeight: '100px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
        }
        else if (mm.endsWith('.rar')) {
            return <a href={mm}> <img src='https://vsudo.net/blog/wp-content/uploads/2019/05/winrar-768x649.jpg' style={{ maxWidth: '100px', maxHeight: '100px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
        }
        else if (mm.endsWith('.mp4')) {
            return <video src={mm} style={{ maxWidth: '300px', maxHeight: '300px', display: 'flex', justifyContent: 'center', zIndex: '5' }} onClick={(e) => { e.preventDefault(); e.target.paused ? e.target.play() : e.target.pause(); }} controls></video>

        }
        else if (mm.endsWith('.xlsx')) {
            return <a href={mm}> <img src='https://tse2.mm.bing.net/th?id=OIP.U0CtQVB5bE_YEsKgokMH4QHaHa&pid=Api&P=0&h=180' style={{ maxWidth: '100px', maxHeight: '100px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
        }
        else if (mm.endsWith('.txt')) {
            return <a href={mm}> <img src='https://tse4.mm.bing.net/th?id=OIP.kf6nbMokM5UoF7IzTY1C5gHaHa&pid=Api&P=0&h=180' style={{ maxWidth: '100px', maxHeight: '100px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
        }
    }
    const fileMessagesFillter = messages.filter(m => {
        const mm = m.content.toLowerCase();
        return (
            mm.endsWith('.docx') ||
            mm.endsWith('.pdf') ||
            mm.endsWith('.rar') ||
            mm.endsWith('.mp4') ||
            mm.endsWith('.xlsx') ||
            mm.endsWith('.txt')

        );
    });
    const btnClose = () => {
        formRefF.current.style.display = 'none';
    }
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
        console.log(files);
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

    const handleSendIconMess = (icon, messageId) => {
        //xu ly o day
        setShowIcons(false);
        const idLastMess = messages.slice(-1)[0];
            const dataUpdateEmoji = {
                newEmoji: icon,
                idMessages: messageId,
                idLastMessageSent: idLastMess._id,
                email: user.email,
            };
            
        updateEmoji(id, dataUpdateEmoji) 
        .then((res) => {
            //console.log(res.data);
        })
        .catch((error) => {
            console.log(error);
        })
    };
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
    const [clickedMessageFeedBackOb, setClickedMessageFeedBackOb] = useState(undefined);
    const handleFeedBackOb = (messageId) => {
        ScrollbarCuoi()
        setClickedMessageFeedBackOb(messageId);
    }
    const checkAnswerMessage = (mm) => {
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
        else if (mm.endsWith('.xlsx')) {
            return <a href={mm}> <img src='https://tse2.mm.bing.net/th?id=OIP.U0CtQVB5bE_YEsKgokMH4QHaHa&pid=Api&P=0&h=180' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
        }
        else if (mm.endsWith('.txt')) {
            return <a href={mm}> <img src='https://tse4.mm.bing.net/th?id=OIP.kf6nbMokM5UoF7IzTY1C5gHaHa&pid=Api&P=0&h=180' style={{ maxWidth: '130px', maxHeight: '130px', display: 'flex', justifyContent: 'center', zIndex: '5' }} target="_blank" rel="noopener noreferrer"></img></a>
        }
        else if (mm.startsWith('https:')) {
            return <a href={mm}><p> {mm}</p></a>
        }
        else {
            return <p>{mm}</p>;
        }
    }
    const imageMessages = messages.filter(m => {
        const mm = m.content.toLowerCase();
        return (
            mm.endsWith('.png') ||
            mm.endsWith('.jpg') ||
            mm.endsWith('.jpeg') ||
            mm.endsWith('.gif') ||
            mm.endsWith('.tiff') ||
            mm.endsWith('.jpe') ||
            mm.endsWith('.jxr') ||
            mm.endsWith('.tif') ||
            mm.endsWith('.bmp')
        );
    }); const lastIndex = imageMessages.length - 1;
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };
    const handleCloseImage = () => {
        setSelectedImage(null);
    };
   
   
    const handleWaitingCall = () => {
        
    const dataCall = {
        idRooms: id,
        userCall: user, 
        userReciveCall: email,
    }
    socket.emit(`userCallVoice`, dataCall)
    };
    const handleCancleCall = () => {
        const dataCancleCall = {
            idRooms: id,
            userCancel: user, 
            userReciveCall: email,
        }
        socket.emit(`cancelVoiceCall`, dataCancleCall)
    }
    const handleWaitingCallVideo = () => {
        const dataCallVideo = {
            idRooms: id,
            userCall: user, 
            userReciveCall: email,
        }
        socket.emit(`userCallVideo`, dataCallVideo)
    }
    const handleCancleCallVideo = () => {
        const dataCancleCall = {
            idRooms: id,
            userCancel: user, 
            userReciveCall: email,
        }
        socket.emit(`cancelVideoCall`, dataCancleCall)
    }
    const existCallVoice = () => {
        const dataCancleCall = {
            idRooms: id,
            userCancel: user, 
            userReciveCall: email,
        }
        socket.emit(`cancelVoiceCall`, dataCancleCall)
    }
    const existCallVideo = () => {
        const dataCancleCall = {
            idRooms: id,
            userCancel: user, 
            userReciveCall: email,
        }
        socket.emit(`cancelVideoCall`, dataCancleCall)
    }
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
                                {areFriends === false && (
                                        <i style={{ fontSize: '13px' }}>Người lạ</i>
                                    )}
                                </div>
                                {areFriends && (
                                    <div className='member'>
                                        {isOnline === true ? (
                                            <i style={{ color: '#4B7F56', fontSize: '13px' }}>Đang trực tuyến</i>
                                        ) : (
                                            <i style={{ color: '#C95E5E', fontSize: '13px' }}>Đang offline</i>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='icon'>
                        
                        
                       
                        {/* <a href={``} target="_blank" rel="noopener noreferrer">
                            <i className='bx bx-phone-call' ></i>
                        </a> */}
                          {/* <i className='bx bx-phone-call'  onClick={handleWaitingCall}></i>
                        
                            <i className='bx bx-camera-movie'  onClick={handleWaitingCallVideo}></i> */}

{areFriends && <i className='bx bx-phone-call' onClick={handleWaitingCall}></i>}
                          
                            {areFriends && <i className='bx bx-camera-movie' onClick={handleWaitingCallVideo}></i>}
                            <i className='bx bx-menu' onClick={handleButtonClick} style={{ cursor: 'pointer' }}></i>
                        </div>
                    </div>
                   
                    {messages.length !== 0 ? (<div className='inf-mess' ref={messRef}>
                    <div style={{ display: 'flex', backgroundColor: 'white', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {renderDisplay()}
                        </div>
                    </div>
                        {messages.map((m) => (
                            <div key={m._id} className={`m ${m.author?.email === user.email ? 'mess-me' : 'mess-you'}`} onMouseLeave={handleMouseLeave} >
                                <img src={m.author.avatar} alt="" style={{ width: '50px', borderRadius: "50px" }} />
                                <div className='inf-you' onMouseEnter={() => handleMouseEnter(m._id)}>
                                    <div className='tt'>
                                        <span>{m.author.fullName}</span>
                                        <span>{timeChat(m.createdAt)}</span>
                                    </div>
                                    {m.answerMessage !== undefined &&
                                        <div style={{ background: '#f4f4f4', padding: '5px', maxWidth: '350px', borderRadius: '5px' }}>
                                            <div style={{ fontSize: '10px' }}>Trả lời :{m.answerMessage.fullName}</div>
                                            <div style={{ fontSize: '13px', maxWidth: '350px', wordBreak: 'break-word', color: '#666' }}>{checkAnswerMessage(m.answerMessage.content)}</div>
                                        </div>}
                                    <div className='content'>
                                        {SendToMesageImage(messageRemoved(m.content, m._id))}
                                         {m.emoji !== "" && (
                                            <div style={{ position: 'absolute', bottom: '0', left: '0', backgroundColor: 'white', padding: '3px', borderRadius: '50%', transform: 'translate(20%,80%)', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                                {m.emoji}
                                            </div>
                                        )}
                                        {like === m._id && (<i style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: 'white', padding: '3px', borderRadius: '50%', transform: 'translate(-50%,80%)', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} className='bx bx-like' onClick={() => setShowIconsMess(m._id)} >{showIconsMess === m._id && (
                                            <div style={{ display: 'flex', position: 'absolute', boxShadow: '0 0 10px rgb(222, 212, 212)', top: '0', left: '0', cursor: 'pointer', transform: 'translate(-59%,-130%)', borderRadius: '5px', backgroundColor: 'white' }}>
                                                {iconsmess.map((icon, index) => (
                                                    <span key={index} style={{
                                                        fontSize: hoveredIcon === icon ? '25px' : '17px',
                                                        transition: 'font-size 0.5s ease', padding: '5px'
                                                    }} onClick={() => handleSendIconMess(icon, m._id)} onMouseEnter={() => handleIconHover(icon)}
                                                        onMouseLeave={handleIconLeave}>{icon}</span>
                                                ))}
                                            </div>
                                        )}</i>)}
                                    </div>

                                    {m.content === messages[messages.length - 1].content && (
                                        <div>
                                            {statusMessage ? 'Đã nhận' : 'Đã đọc'}
                                        </div>
                                    )}
                                </div>
                                {hoveredMessage === m._id && !submitClicked && (
                                    <button style={{ height: '30px', fontWeight: 'bold', margin: '10px', backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ccc', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', marginTop: '10px' }} onClick={() => handleThreeClick(m._id)}>...</button>
                                )}

                                {clickedMessage === m._id && (
                                    // <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                    //     <button type='submit' style={{ backgroundColor: '#ffcccc', color: '#cc0000', border: '1px solid #cc0000', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', marginBottom: '10px', fontSize: '10px', width: '80px' }} onClick={() => handleDelete(m._id)}>Delete</button>
                                    //     {showErrorModal && <ModalError message={errorMessage} onClose={handleCloseErrorModal} />}

                                    //     <button style={{ backgroundColor: '#ccffcc', color: '#006600', border: '1px solid #006600', borderRadius: '5px', padding: '5px 5px', cursor: 'pointer', fontSize: '10px', width: '80px' }} onClick={() => handleUndo(m._id, m.content)} >Thu hồi</button>
                                    //     <button style={{ backgroundColor: '#ccccff', color: '#006600', border: '1px solid #006600', borderRadius: '5px', padding: '5px 5px', cursor: 'pointer', fontSize: '10px', width: '80px' }} onClick={() => handleUndo(m._id, m.content)} >Phản hồi</button>
                                    // </div>
                                    <div style={{ display: 'flex', marginTop: '5px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0.1, 0.1, 0.1, 0.1)' }}>

                                    <i className='bx bxs-tag-x' style={{ height: '20px', width: '20px', margin: '10px', color: '#333', borderRadius: '5px', cursor: 'pointer', fontSize: '15px' }} onMouseOver={(e) => { e.target.style.backgroundColor = '#f0f0f0'; }} onMouseOut={(e) => { e.target.style.backgroundColor = 'white'; }} onClick={() => handleDelete(m._id)}></i>
                                    {showErrorModal && <ModalError message={errorMessage} onClose={handleCloseErrorModal} />}
                                    <i className='bx bx-revision' style={{ height: '20px', width: '20px', margin: '10px', color: '#333', borderRadius: '5px', cursor: 'pointer', fontSize: '15px' }} onMouseOver={(e) => { e.target.style.backgroundColor = '#f0f0f0'; }} onMouseOut={(e) => { e.target.style.backgroundColor = 'white'; }} onClick={() => handleUndo(m._id, m.content)}></i>
                                    <i className='bx bx-subdirectory-left' style={{ height: '20px', width: '20px', margin: '10px', color: '#333', borderRadius: '5px', cursor: 'pointer', fontSize: '15px' }} onClick={() => handleFeedBackOb(m)} onMouseOver={(e) => { e.target.style.backgroundColor = 'white'; }} onMouseOut={(e) => { e.target.style.backgroundColor = '#f0f0f0'; }}></i>
                                </div>
                                )}
                                {changeText === m._id && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                        <input type="text" style={{ marginBottom: '5px', padding: '8px', border: '1px solid #ccc', borderRadius: '5px', width: '200px' }} placeholder='Please enter ' value={editedMessage} onChange={handleChangeText} />
                                        <button style={{ padding: '8px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => changeTextButton(m._id)} >Submit</button>
                                        {showErrorModal && <ModalError message={errorMessage} onClose={handleCloseErrorModal} />}

                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && <div style={{ position: "absolute", bottom: "110px" }}>{user.fullName.slice(-9)} Is Typing...</div>}
                    </div>
                        ) : (
                            <div className='inf-mess' ref={messRef}>
                                <div style={{ display: 'flex', backgroundColor: 'white', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        {renderDisplay()}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                                    <img
                                        src={avatar} style={{ width: '200px', height: '200px', borderRadius: '50%', border: '1px solid #333', marginBottom: '20px' }}
                                    />
                                    <span id='name' style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }} > {nameRoom} </span>
                                    <button
                                        onClick={handleButtonClickF}
                                        style={{
                                            width: '150px',
                                            height: '40px',
                                            backgroundColor: '#E99D49',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                                            transition: 'background-color 0.3s ease',
                                        }}  > Xem trang chủ </button>
                                </div>

                            </div>
                        )}

                    <div className='soan'>
                    {clickedMessageFeedBackOb !== undefined && <div style={{ display: 'flex', alignItems: 'flex-start', position: 'absolute', transform: 'translateY(-80%)', left: '1%', borderLeft: '3px solid orange', paddingLeft: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <i className='bx bxs-quote-right'></i>
                                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>{clickedMessageFeedBackOb.author.fullName}</p>
                                </div>
                                <div style={{ backgroundColor: '#F5F5F5', borderRadius: '10px', padding: '8px', maxWidth: '100%', display: 'flex' }}>
                                    <p style={{ margin: '0', fontSize: '13px', color: '#333' }}>{clickedMessageFeedBackOb.content}</p>

                                </div>

                            </div>
                            <div onClick={() => setClickedMessageFeedBackOb(undefined)} style={{ padding: '10px' }}>X</div>
                        </div>}

                        <div className='nd'>

                            <input
                                type="text"
                                placeholder='Type a message here..'
                                value={texting}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                   
                      
                        <div className='cachthuc'>
                        <i className='bx bx-smile' style={{ position: 'relative',cursor:'pointer' }} onClick={() => setShowIcons(true)}>{showIcons && (
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
                            <i className='bx bx-image-alt' style={{cursor:'pointer'}} onClick={handleSendImage} ></i>
                            <i className='bx bx-link-alt'  style={{cursor:'pointer'}} onClick={handleSend}></i>
                            <i
                                onClick={handleSendMess}
                                className={`bx bxs-send ${texting === '' ? 'disabled' : ''} ${isActive ? 'active' : ''}`}
                                style={{ cursor: texting === '' ? 'not-allowed' : 'pointer' }}
                            ></i>

{showErrorModal && <ModalError message={errorMessage} onClose={handleCloseErrorModal} />}

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
                        <img src={background} alt="" style={{ width: '400px', height: '140px', borderRadius: '8px', marginBottom: '20px' }} />
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
                {changeAnh ?
                        (<div className='section-four-cro'> <div className='title' style= {{ position: 'relative' }}>

                            <i className='bx bxs-chevron-left' onClick={() => setChangeAnh(false)} style={{ fontSize: '25px', position: 'absolute', left: '10px' }}></i> <h3>Kho lưu trữ</h3>
                        </div>
                            <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '10px' }}>
                                <div onClick={() => setTestTrang('a')}>Image </div>
                                <div onClick={() => setTestTrang('b')}>File </div>
                                <div onClick={() => setTestTrang('c')}>Video </div>
                            </div>
                            {testTrang === 'a' && (<div className='video'>
                                <div className='title-video'>
                                    <span>Image</span>
                                    <i className='bx bx-image' ></i>
                                </div>
                                <div className='videos'>

                                    {imageMessages.map(m => <img key={m._id}  src={m.content} alt="" style={{ width: '100px', height: '100px' }} onClick={() => handleImageClick(m.content)} />)}
                                    {selectedImage && (
                                        <div className="image-modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '10' }} onClick={handleCloseImage}>
                                            <img src={selectedImage} alt="" style={{ maxWidth: '90%', maxHeight: '90vh', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                                        </div>
                                    )}
                                </div>

                            </div>)}
                            {testTrang === 'b' && (<div className='video'>
                                <div className='title-file'>
                                    <span>File</span>

                                </div>
                                <div className='videos'>

{fileMessagesFillter.map(m => <div>{fileMessages(m.content)} </div>)}

</div>


                            </div>)}
                            {testTrang === 'c' && (<div className='file'>
                                <div className='title-file'>
                                    <span>Video</span>

                                </div>
                                
                            </div>)}

                        </div>) : (<div className='section-four-cro'>
                            <div className='title'>
                                <h3>Thông tin</h3>
                            </div>
                            <div className='avt'>
                                <img src="https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain" alt="" style={{ width: '70px', borderRadius: "50px" }} />
                            </div>
                            <div className='inf'>
                                <p>{nameRoom}</p>
                                
                            </div>

                            <div className='thaotac'>
                                <div className='thaotac-one'>
                                    <i className='bx bx-bell'></i>
                                    <span style={{ fontSize: '12px' }}>Tắt thông báo</span>
                                </div>
                                <div className='thaotac-one'>
                                    <i className='bx bx-group'></i>
                                    <span style={{ fontSize: '12px' }}>Thêm thành viên </span>
                                </div>
                                <div className='thaotac-one'>
                                    <i className='bx bxs-coffee-togo'></i>
                                    <span style={{ fontSize: '12px' }}>Xóa trò chuyện</span>
                                </div>
                            </div>
                            <div className='video'>
                                <div className='title-video'>
                                    <span>Image</span>
                                    <i className='bx bx-image' ></i>
                                </div>
                                <div className='videos'>

                                    {imageMessages.slice(Math.max(lastIndex - 5, 0), lastIndex + 1).map(m => <img key={m._id} src={m.content} alt="" style={{ width: '100px', height: '100px' }} onClick={() => handleImageClick(m.content)} />)}
                                    {selectedImage && (
                                        <div className="image-modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '10' }} onClick={handleCloseImage}>
                                            <img src={selectedImage} alt="" style={{ maxWidth: '90%', maxHeight: '90vh', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                                        </div>
                                    )}
                                </div>
                                <button style={{
                                    width: '100%',
                                    height: '33px',
                                    padding: "12px 0",
                                    marginTop: '5px',
                                    backgroundColor: '#febc82', /* Gray */
                                    border: 'none',
                                    color: 'white',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    fontSize: '16px',
                                    transitionDuration: '0.4s',
                                    cursor: 'pointer',
                                    borderRadius: '12px',
                                    // boxShadow: '0 9px #999'
                                }}

                                    onClick={() => setChangeAnh(true)}>See all</button>
                            </div>
                            <div className='video'>
                                <div className='title-file'>
                                    <span>File</span>

                                </div>
                                <div className='videos'>

                                 
                                    {fileMessagesFillter.map(m => <div>{fileMessages(m.content)} </div>)}

                                </div>
                                <button style={{
                                    width: '100%',
                                    height: '33px',
                                    padding: "12px 0",
                                    marginTop: '5px',
                                    backgroundColor: '#febc82', /* Gray */
                                    border: 'none',
                                    color: 'white',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    fontSize: '16px',
                                    transitionDuration: '0.4s',
                                    cursor: 'pointer',
                                    borderRadius: '12px',
                                    // boxShadow: '0 9px #999'
                                }}

                                    onClick={() => setChangeAnh(true)}>See all</button>

                            </div>
                        </div>)
                    }
                </div>
                {/* form dang goi maasy cai hinh coi name room ko can chinh*/}
                {videoCall && (<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', width: '400px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                        <div className='titleadd' style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px', position: 'relative' }}>
                            <h2 style={{ fontSize: '15px', color: '#333', textAlign: 'center', marginBottom: '10px' }}>Đang gọi</h2>
                            <i className='bx bx-x' style={{ cursor: 'pointer', fontSize: '25px', position: 'absolute', right: '0', top: '0' }} onClick={existCallVoice}></i>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                            <img src={avatar} alt="" style={{ width: '75px', height: '75px', borderRadius: '50%', margin: '10px' }} />
                            <div style={{ fontSize: '18px' }}>Đang gọi cho {nameRoom}</div>
                        </div>



                        <div className='endAdd' style={{ display: 'flex', justifyContent: 'space-around' }}>

                            <i className='bx bxs-phone-incoming' onClick={handleCancleCall} style={{ backgroundColor: 'red', color: 'white', padding: '12px', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '25px', transition: 'background-color 0.3s' }}></i>

                        </div>
                    </div>
                </div>)}
                {videoCallCam && (<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', width: '400px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                        <div className='titleadd' style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px', position: 'relative' }}>
                            <h2 style={{ fontSize: '15px', color: '#333', textAlign: 'center', marginBottom: '10px' }}>Đang gọi</h2>
                            <i className='bx bx-x' style={{ cursor: 'pointer', fontSize: '25px', position: 'absolute', right: '0', top: '0' }} onClick={existCallVideo}></i>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                            <img src={avatar} alt="" style={{ width: '75px', height: '75px', borderRadius: '50%', margin: '10px' }} />
                            <div style={{ fontSize: '18px' }}>Đang gọi cho {nameRoom}</div>
                        </div>



                        <div className='endAdd' style={{ display: 'flex', justifyContent: 'space-around' }}>

                            <i className='bx bxs-phone-incoming' onClick={handleCancleCallVideo} style={{ backgroundColor: 'red', color: 'white', padding: '12px', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '25px', transition: 'background-color 0.3s' }}></i>

                        </div>
                    </div>
                </div>)}
            </div>) : (<div>

<div style={{ fontSize: '70px', padding: '50px' }}> <span style={{ animation: 'bouncel2 1s' }}>W</span><span style={{ animation: 'bouncel2 1.2s' }}>e</span><span style={{ animation: 'bouncel2 1.4s' }}>l</span><span style={{ animation: 'bouncel2 1.6s' }}>c</span><span style={{ animation: 'bouncel2 1.8s' }}>o</span><span style={{ animation: 'bouncel2 2s' }}>m</span><span style={{ animation: 'bouncel2 2.2s' }}>e</span></div>
<div style={{ fontSize: '120px', color: ' rgb(240, 143, 23)', paddingLeft: '10%', display: 'flex' }}><img src="https://zenkit.com/wp-content/uploads/2020/11/zenchat-experience.jpg" alt="" style={{ width: '250px' }} /><span style={{ animation: 'bouncel2 2.4s' }}>Z</span><span style={{ animation: 'bouncel2 2.6s' }}>e</span><span style={{ animation: 'bouncel2 2.8s' }}>n</span><span style={{ animation: 'bouncel2 3s' }}>C</span><span style={{ animation: 'bouncel2 3.2s' }}>h</span><span style={{ animation: 'bouncel2 3.4s' }}>a</span><span style={{ animation: 'bouncel2 3.6s' }}>t</span> </div>
</div>)}


        </div>
    )
}

