import React, { useState, useContext, useEffect, useRef } from 'react'
import { getGroupsMessages,getListRooms,kickGroups,cancelCallGroup,franchiseGroups,deleteMessagesGroups,updateGroups,createMessagesGroupFeedBack,recallMessagesGroups ,deleteGroup, updateEmojiGroup  ,leaveGroup, createMessagesGroup, createMessagesFile, attendGroup } from '../../../untills/api';
import { AuthContext } from '../../../untills/context/AuthContext'
import { SocketContext } from '../../../untills/context/SocketContext';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import ErrorMicroInteraction from './giphy.gif'
import SuccessMicroInteraction from './Success Micro-interaction.gif'
import keyImage from './key.png'

const MessGroup = ({ group }) => {
     const [optionsVisible, setOptionsVisible] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [loi, setLoi] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setSelectedId(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    const [messagesGroups, setMessagesGroups] = useState([]);
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [texting, setTexting] = useState('');
    // const [showHover, setShowHover] = useState(false); // State để điều khiển việc hiển thị hover
    const [submitClicked, setSubmitClicked] = useState(false); // State để theo dõi trạng thái của nút "Submit"
    const [recalledMessages, setRecalledMessages] = useState([]);
    const [displayMode, setDisplayMode] = useState('none');
    const [sendFile, setSendFile] = useState([])
    const [sendImage, setSendImage] = useState([])
    const [editedMessage, setEditedMessage] = useState('');
    const [changeText, setChangeText] = useState(null)
    const [clickedMessage, setClickedMessage] = useState(null);
    const [hoveredMessage, setHoveredMessage] = useState(null);
    const [showIcons, setShowIcons] = useState(false);
    const [participants, setParticipants] = useState([]);
    //cảm giác nút bấm
    const [isActive, setIsActive] = useState(false);
    const [friendsGroup, setFriendGroup] = useState([]);
    const [nameOfGroups, setNameOfGroups] = useState()
    const thuNhoBaRef = useRef();
    const thuNhoBonRef = useRef();
    const [creatorGroup, setCreatorGroup] = useState({})
    const [videoCallGroups, setVideoCallGroups] = useState(false);
    const waitingCallGroupEnd = useRef();
    const timeChat = (dataTime) => {
        const time = dataTime.substring(11, 16);
        return time;
    }
    useEffect(() => {
        
        
        if (group === undefined) {
            return;
        }
        setUpdateImageGroup(group.avtGroups)
        setTam(group.avtGroups)
        setNameOfGroups(group.nameGroups)
        setCreatorGroup(group.creator)
        if (user.email === group.creator.email) {
            setLeader(true)
        } else {
            setLeader(false)
        }
        const GroupMessages = {
            groupId: group._id
        }
        getGroupsMessages(GroupMessages)
            .then((data) => {
                setMessagesGroups(data.data);
                setParticipants(group.participants)
               
            })
            .catch((err) => {
                console.log(err);
            })
            getListRooms()
            .then(res => {
                const roomsWithFriends = res.data.filter(room => room.friend === true);
                // Cập nhật state với các phòng đã lọc
                setFriendGroup(roomsWithFriends);
       
            })
            .catch(err => {
                console.log(err);
                console.log("Đã rơi zô đây");
            })
    }, [group, user.email])
    useEffect(() => {
        if (group === undefined) {
            return;
        }
        socket.on('connected', () => console.log('Connected'));
        socket.on(`leaveGroupsId${group._id}`, (data) => {
            if (data.userLeave !== user.email) {
                setParticipants(data.groupsUpdate.participants)
            }
            
        })
        socket.on(group._id, (data) => {
            setMessagesGroups(prevMessages => [...prevMessages, data.message])
        })
        socket.on(`emojiGroup${group._id}`, data => {
            setMessagesGroups(prevMessagesGroup => {
                return prevMessagesGroup.map(message => {
                    if (message === undefined || data.messagesUpdate === undefined) {
                        return message;
                    }
                    if (message._id === data.messagesUpdate._id) {

                        return data.messagesUpdate;
                    }
                    return message;
                })
            })
        })
        socket.on(`deleteMessageGroup${group._id}`, (data) => {
            if (data) {
                // Loại bỏ tin nhắn bằng cách filter, không cần gói trong mảng mới
                setMessagesGroups(prevMessages => prevMessages.filter(item => item._id !== data.idMessages));

            }
        }) 
        socket.on(`recallMessageGroup${group._id}`, data => {
            if (data) {
                setMessagesGroups(preMessagesGroups=> {
                return preMessagesGroups.map(message => {
                    if (message === undefined || data.messagesGroupUpdate === undefined) {
                        return message;
                    }
                    if (message._id === data.messagesGroupUpdate._id) {

                        return data.messagesGroupUpdate;
                    }
                    return message;
                    })
                })
            }
            
        })
        socket.on(`attendGroup${group._id}`, (data) => {
            if (data) {
               setParticipants(data.groupsUpdate.participants) 
            }
            
        })
        socket.on(`feedBackGroup${group._id}`, (data) => {
            setMessagesGroups(prevMessages => [...prevMessages, data.message])
        })
        socket.on(`kickOutGroup${group._id}` , (data) => {
            setParticipants(data.groupsUpdate.participants)
        })
        socket.on(`updateGroup${group._id}`, data => {
            setTam(data.avtGroups)
            setUpdateImageGroup(data.avtGroups)
            setNameGroup(data.nameGroups)
            setNameOfGroups(data.nameGroups)
        })
        socket.on(`franchiseGroup${group._id}` , data => {
            if (data) {
                setParticipants(data.groupsUpdate.participants)

                setCreatorGroup(data.groupsUpdate.creator)
                if (user.email === data.groupsUpdate.creator.email) {
                    setLeader(true)
                } else {
                    setLeader(false)
                }
            }
            
        })
        return () => {
            socket.off('connected')
            socket.off(`leaveGroupsId${group._id}`)
            socket.off(group._id)
            socket.off(`emojiGroup${group._id}`)
            socket.off(`deleteMessageGroup${group._id}`)
            socket.off(`recallMessageGroup${group._id}`)
            socket.off(`attendGroup${group._id}`)
            socket.off(`feedBackGroup${group._id}`)
            socket.off(`kickOutGroup${group._id}`)
            socket.off(`updateGroup${group._id}`)
            socket.off(`franchiseGroup${group._id}`)
        }
    },[socket, group])
    useEffect(() => {
        socket.on('connected', () => console.log('Connected'));
        socket.on(`updateAcceptFriendsGroups${user.email}`, data => {
            if (data) {
                setFriendGroup(prevGroups => [...prevGroups, data])
               //console.log(data);
            }
        })
        socket.on(`updateUnFriendsGroups${user.email}`, data => {
            if (data) {
                setFriendGroup(prevGroups => prevGroups.filter(item => item._id !== data.roomsUpdate))
            }
        })
        return () => {
            socket.off('connected');
            socket.off(`updateAcceptFriendsGroups${user.email}`)
           socket.off(`updateUnFriendsGroups${user.email}`)
        }
    }, [socket])
    useEffect(() => {
        socket.on(`userCallGroups${user.email}`, (data) => {
            if(data.errorCallGroup) {
                // alert("Bạn đang có cuộc gọi khác!!!")
                setErrorMessage('Bạn đang có cuộc gọi khác!!!')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            return;
            } else if(data.existCallGroup) {
                // alert("Bạn đã trong cuộc gọi này")
                setErrorMessage('Bạn đã trong cuộc gọi này')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            return;
            } else if(data.callingGroup) {
                socket.emit('userCanAttendCallGroups', { idGroups: data.idGroups, user: user })
                
            } else if (data.errorNotUserOnline) {
                // alert("Hiện tại tất cả người dùng trong nhóm đang bận");
                setErrorMessage('Hiện tại tất cả người dùng trong nhóm đang bận')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            return;
            } else {
                setVideoCallGroups(true);
                waitingCallGroupEnd.current = setTimeout(() => {
                    const dataCallGroup = {
                        content: `Các bạn đã nhỡ cuộc gọi của tôi 😥`,
                        groupsID: group._id,
                    }
                    createMessagesGroup(dataCallGroup)
                    setVideoCallGroups(false);
                    
                    const dataCancelCall = {
                        idGroups: group._id,
                        nameGroups: "",
                        avtGroups: "",
                    }
                    cancelCallGroup(dataCancelCall)
                }, 15000);
                
            }
           
        })
        socket.on(`userCancelCallGroups${user.email}`, (data) => {
            if(data.error) {
                // alert("Bạn không có cuộc gọi nào từ nhóm này")
                setErrorMessage('Bạn không có cuộc gọi nào từ nhóm này')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            return;
            } else {
                clearTimeout(waitingCallGroupEnd.current);
                setVideoCallGroups(false);
            }
        })
        socket.on(`userRejectCallGroupsRecipient${user.email}`, (data) => {
            if(data.errorNullUser) {
                setVideoCallGroups(false);
                clearTimeout(waitingCallGroupEnd.current);
                // alert("Không ai tham gia cuộc gọi của bạn")
                setErrorMessage('Không ai tham gia cuộc gọi của bạn')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            return;
            } else {
                // alert(`${data.userNotAttend} đang bận`)
                setErrorMessage(`${data.userNotAttend} đang bận`)
                setShowErrorModal(true)
                setTimeout(() => {
                    setShowErrorModal(false)
                }, 2000);
            }
        })
        socket.on(`userAttendCallGroupOwner${user.email}`, (data) => {
            if(data) {
                clearTimeout(waitingCallGroupEnd.current);
                setVideoCallGroups(false);
                const data2 = {
                    content: `Đang có cuộc gọi nhóm ${group.nameGroups} diễn ra 📞`,
                    groupsID: group._id,
                };
                createMessagesGroup(data2)
                window.open(`/video_call_group/${data.idGroups}/${user.fullName}/${data.groupCall.participants.length}`)
            }
            
        })
        socket.on(`userAttendCallGroups${user.email}`, data => {
            if(data.error) {
                // alert("Hiện tại nhóm này đang không có cuộc gọi nào!!!")
                setErrorMessage('Hiện tại nhóm này đang không có cuộc gọi nào!!!')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            return;
            } else {
                window.open(`/video_call_group/${data._id}/${user.fullName}/${data.participants.length}`)
            }
            
        })
        return () => {
            socket.off(`userCallGroups${user.email}`);
            socket.off(`userCancelCallGroups${user.email}`);
            socket.off(`userRejectCallGroupsRecipient${user.email}`)
            socket.off(`userAttendCallGroupOwner${user.email}`)
            socket.off(`userAttendCallGroups${user.email}`)
        }
    },[socket, user, user.email, user.fullName])
    const setTingNameGroups = (groups) => {
        if (nameOfGroups === '') {
            return `Groups của ${groups.creator.fullName}`
        } else {
            return nameOfGroups;
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
    const handleSendMess = () => {
        if (texting === '') {
            // alert("Mời bạn nhập tin nhắn");
            setErrorMessage('Mời bạn nhập tin nhắn')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            return;
        }
        else if (!group._id) {
            // alert("Không tìm thấy Phòng bạn muốn gửi tin nhắn");
            setErrorMessage('Không tìm thấy Phòng bạn muốn gửi tin nhắn')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            return;
        }
        else {
            // feedback
            setIsActive(true); // Kích hoạt hiệu ứng khi nút được click
            if (sendFile.length > 0) {
                const formData = new FormData();
                formData.append('file', sendFile[0]);
                createMessagesFile(formData)
                    .then((resFile) => {
                        if (clickedMessageFeedBackOb) {
                            const dataGroupsMessages= {
                                content: resFile.data,
                                idMessages: clickedMessageFeedBackOb._id,
                            };
                            createMessagesGroupFeedBack(group._id,dataGroupsMessages)
                            .then((res) => {
                                setTexting("");
                                setSendFile([]);
                                ScrollbarCuoi();
                                setClickedMessageFeedBackOb(undefined)
                                if (res.data.status === 400) {
                                    // alert("Hiện tại bạn không còn trong nhóm này")
                                    setErrorMessage('Hiện tại bạn không còn trong nhóm này')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
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
                                    setErrorMessage('Lỗi Server')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                                    window.location.reload();
                                }


                            })
                        } else {
                            const data1 = {
                                content: resFile.data,
                                groupsID: group._id,
                            };
                            createMessagesGroup(data1)
                            .then((res) => {
                                setTexting("");
                                setSendFile([]);
                                ScrollbarCuoi();
                                if (res.data.status === 400) {
                                    // alert("Hiện tại bạn không còn trong nhóm này")
                                    setErrorMessage('Hiện tại bạn không còn trong nhóm này')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
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
                                    setErrorMessage('Lỗi Server')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                                    window.location.reload();
                                }


                            })
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })

            }
            else if (sendImage.length > 0) {
                const formData1 = new FormData();
                formData1.append('file', sendImage[0]);
                createMessagesFile(formData1)
                    .then((resFile) => {
                        if (clickedMessageFeedBackOb) {
                            const dataMessagesGroups2 = {
                                content: resFile.data,
                                idMessages: clickedMessageFeedBackOb._id,
                            };
                            createMessagesGroupFeedBack(group._id,dataMessagesGroups2)
                            .then((res) => {
                                setTexting("");
                                setSendImage([]);
                                ScrollbarCuoi();
                                setClickedMessageFeedBackOb(undefined)
                                if (res.data.status === 400) {
                                    // alert("Hiện tại bạn không còn trong nhóm này")
                                    setErrorMessage('Hiện tại bạn không còn trong nhóm này')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
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
                                    setErrorMessage('Lỗi Server')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                                    window.location.reload();
                                }
                            })
                        } else {
                            const data2 = {
                                content: resFile.data,
                                groupsID: group._id,
                            };
                            createMessagesGroup(data2)
                                .then((res) => {
                                    setTexting("");
                                    setSendImage([]);
                                    ScrollbarCuoi();
                                    if (res.data.status === 400) {
                                        // alert("Hiện tại bạn không còn trong nhóm này")
                                        setErrorMessage('Hiện tại bạn không còn trong nhóm này')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
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
                                        setErrorMessage('Lỗi Server')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
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
                    const dataMessagesGroups3 = {
                        content: texting,
                        idMessages: clickedMessageFeedBackOb._id,
                    };
                    createMessagesGroupFeedBack(group._id,dataMessagesGroups3)
                    .then((res) => {
                        
                        setTexting("");
                        ScrollbarCuoi();
                        setClickedMessageFeedBackOb(undefined)
                        if (res.data.status === 400) {
                            // alert("Hiện tại bạn không còn trong nhóm này")
                            setErrorMessage('Hiện tại bạn không còn trong nhóm này')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
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
                            setErrorMessage('Lỗi Server')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                            window.location.reload();
                        }


                    })
                } else {
                    const data = {
                        content: texting,
                        groupsID: group._id,
                    };
                    createMessagesGroup(data)
                        .then((res) => {
                            setTexting("");
                            
                            if (res.data.status === 400) {
                                // alert("Hiện tại bạn không còn trong nhóm này")
                                setErrorMessage('Hiện tại bạn không còn trong nhóm này')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                                window.location.reload();
                            }
                            setTimeout(() => {
                                setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                            }, 300);
                            
                        })
                        .catch((err) => {
                            if (err.status === 400) {
                                // alert("Lỗi Server")
                                setErrorMessage('Lỗi Server')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
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
        // socket.emit(`onUserTyping`, { groupsId: group._id, phoneNumber: user.phoneNumber })
    };
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

    const handleDelete = (messageId) => {
        const idLastMess = messagesGroups.slice(-1)[0]
        const dataDeleteMessages = {
            idMessages: messageId,
            idLastMessageSent: idLastMess._id,
        }
        deleteMessagesGroups(group._id, dataDeleteMessages)
            .then((res) => {
                if (res.data.response === "Bạn không phải là chủ tin nhắn") {
                    // alert("Bạn không phải chủ tin nhắn nên không thể xóa")
                    setErrorMessage('Bạn không phải chủ tin nhắn nên không thể xóa')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                }
                if (res.status !== 200) {
                    // alert("Không thể xóa được tin nhắn")
                    setErrorMessage('Không thể xóa được tin nhắn')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                    window.location.reload();
                    return;
                }
            })
            .catch((err) => {
                // alert("Lỗi hệ thống")
                setErrorMessage('Lỗi hệ thống')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
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



    const handleUndo = (messageId) => {
        const messageToEdit = messagesGroups.find(message => message._id === messageId);
        if (messageToEdit.content === "") {
            // alert("Tin nhắn đã được thu hồi")
            setLoi(true)
            setErrorMessage('Tin nhắn đã được thu hồi')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
        } else {
            const idLastMess = messagesGroups.slice(-1)[0];
         const dataUpdateMessage = {
             idMessages: messageId,
             idLastMessageSent: idLastMess._id,
             email: user.email,
         };
         recallMessagesGroups(group._id, dataUpdateMessage)
             .then(res => {
                 if (res.data.response === "Bạn không phải là chủ tin nhắn") {
                    //  alert("Bạn không phải là chủ tin nhắn nên không thể cập nhật");
                    setErrorMessage('Bạn không phải là chủ tin nhắn nên không thể cập nhật')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                     return;
                 }
                 if (res.status !== 200) {
                    //  alert("Không thể cập nhật được tin nhắn")
                    setErrorMessage('Không thể cập nhật được tin nhắn')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                     window.location.reload();
                     return;
                 }
                 // Cập nhật trạng thái của hoveredMessage và changeText
                 setHoveredMessage(null);
                 setChangeText(null);
             })
             .catch(err => {
                //  alert("Lỗi hệ thống")
                setErrorMessage('Lỗi hệ thống')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
             });
        
        }
         // Nếu ô input không rỗng, thực hiện cập nhật tin nhắn
         

    };
    const handleChangeText = (e) => {

        setEditedMessage(e.target.value);
    };
    // Hàm xử lý khi nhấn nút "Submit"
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

    const handleSendIconMess = (icon, messageId) => {
        //xu ly o day
        setShowIcons(false);
        const idLastMess = messagesGroups.slice(-1)[0];
        const dataUpdateEmoji = {
            newEmoji: icon,
            idMessages: messageId,
            idLastMessageSent: idLastMess._id,
            email: user.email,
        };

        updateEmojiGroup(group._id, dataUpdateEmoji)
            .then((res) => {
                //console.log(res.data);
            })
            .catch((error) => {
                console.log(error);
            })
    };
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
        if (user.email === creatorGroup.email) {
            const data = {
                groupId: group._id
            }
            deleteGroup(data.groupId)
            .then((res) => {
                if(res.data.creator.email)
                {
                    // alert("Giải tán nhóm thành công")
                    setLoi(true)
                    setErrorMessage('Giải tán nhóm thành công')
                setShowErrorModal(true)
                formRefF.current.style.display = 'none'
                setTimeout(() => {
                    setShowErrorModal(false)
                }, 2000);
                } else {
                    // alert("Giải tán phòng không thành công")
                    setLoi(false)
                    setErrorMessage('Giải tán phòng không thành công')
                setShowErrorModal(true)
                setTimeout(() => {
                    setShowErrorModal(false)
                }, 2000);
                }
                
            })
            .catch((err) => {
                console.log(err);
                // alert("Lỗi hệ thống");
                setErrorMessage('Lỗi hệ thống')
                setShowErrorModal(true)
                setTimeout(() => {
                    setShowErrorModal(false)
                }, 2000);
            })
        }
        else {
            const data = {
                groupId: group._id
            }
            leaveGroup(data)
            .then((res) => {
                if (res.data.message === "Bạn là chủ phòng bạn không thể rời đi") {
                    
                    setErrorMessage("Bạn là chủ phòng bạn không thể rời đi")
                    setShowErrorModal(true)
                    setTimeout(() => {
                        setShowErrorModal(false)
                    }, 2000);
                } else if(res.data.status === 400) {
                    // alert("Rời phòng không thành công")
                    setErrorMessage('Rời phòng không thành công')
                setShowErrorModal(true)
                setTimeout(() => {
                    setShowErrorModal(false)
                }, 2000);
                } else {
                    
                    setParticipants(res.data.groupsUpdate.participants)
                    // alert("Rời phòng thành công")
                    setLoi(true)
                    setErrorMessage('Rời phòng thành công')
                setShowErrorModal(true)
                formRefF.current.style.display = 'none'
                setTimeout(() => {
                    setShowErrorModal(false)
                }, 2000);
                }
            })
            .catch((err) => {
                console.log(err);
                // alert("Lỗi Server")
                setErrorMessage('Lỗi Server')
                setShowErrorModal(true)
                setTimeout(() => {
                    setShowErrorModal(false)
                }, 2000);
            })
        }
    }
    // Giải tán
    const handleDissolution = () => {
        const data = {
            groupId: group._id
        }
        deleteGroup(data.groupId)
        .then((res) => {
            if(res.data.creator.email)
            {
                // alert("Giải tán nhóm thành công")
                setLoi(true)
                setErrorMessage('Giải tán nhóm thành công')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            } else {
                // alert("Giải tán phòng không thành công")
                setLoi(false)
                setErrorMessage('Giải tán phòng không thành công')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            }
            
        })
        .catch((err) => {
            console.log(err);
            // alert("Lỗi hệ thống");
            setErrorMessage('Lỗi hệ thống')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
        })
    }
    const handleLeaveGroup = () => {
        const data = {
            groupId: group._id
        }
        leaveGroup(data)
        .then((res) => {
            if (res.data.message === "Bạn là chủ phòng bạn không thể rời đi") {
                // alert(res.data.message);
                setErrorMessage('Bạn là chủ phòng bạn không thể rời đi')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            } else if(res.data.status === 400) {
                // alert("Rời phòng không thành công")
                setErrorMessage('Rời phòng không thành công')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            } else {
                
                setParticipants(res.data.groupsUpdate.participants)
                // alert("Rời phòng thành công")
                setLoi(true)
                setErrorMessage('Rời phòng thành công')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            }
        })
        .catch((err) => {
            console.log(err);
            // alert("Lỗi Server")
            setErrorMessage('Lỗi Server')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
        })
    }
    const formRefAddMember = useRef(null);
    const handAddMember = () => {
        if (formRefAddMember.current.style.display === 'none') {
            const joinedFriends = participants.map(m => m.phoneNumber);
            const themDoMang = group.creator.phoneNumber;
            joinedFriends.push(themDoMang);
            setJoinedFriends(joinedFriends);
            formRefAddMember.current.style.display = 'flex';
        } else {

            formRefAddMember.current.style.display = 'none';
        }
    };
    const btnCloseAddMember = () => {
        setSelectedItems([]);
        formRefAddMember.current.style.display = 'none';
    }
    const [selectedItems, setSelectedItems] = useState([]);
    const [joinedFriends, setJoinedFriends] = useState([]);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedItems(prevSelectedItems => [...prevSelectedItems, value]);
        } else {
            setSelectedItems(prevSelectedItems => prevSelectedItems.filter(item => item !== value));
        }
    };
    const addMember = () => {
        const data = {
            participants: selectedItems,
            groupId: group._id,
        }
        attendGroup(data)
        .then((res) => {
            if(res.data.groupsUpdate) {
                formRefAddMember.current.style.display = 'none';
                setSelectedItems([])
                // alert("Thêm thành viên thành công")
                setLoi(true)
                setErrorMessage('Thêm thành viên thành công')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                res.data.userAttends.forEach((item) => {
                    const data2 = {
                        content: `${user.fullName} đã mời ${item.fullName} vào nhóm`,
                        groupsID: group._id,
                    };
                    createMessagesGroup(data2)
                        .then((res) => {
                            setTexting("");
                            setSendImage([]);
                            ScrollbarCuoi();
                            if (res.data.status === 400) {
                                // alert("Hiện tại bạn không còn trong nhóm này")
                                setErrorMessage('Hiện tại bạn không còn trong nhóm này')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
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
                                setErrorMessage('Lỗi Server')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                                window.location.reload();
                            }


                        })
                })
                
            }
            else {
                // alert("Bạn không còn là thành viên trong nhóm")
                setErrorMessage('Bạn không còn là thành viên trong nhóm')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                window.location.reload();
            }
        })
        .catch((err) => {
            console.log(err);
            // alert("Lỗi hệ thống")
            setErrorMessage('Lỗi hệ thống')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
        })
    }
    const [clickedMessageFeedBackOb, setClickedMessageFeedBackOb] = useState(undefined);
    const handleFeedBackOb = (messageId) => {
        ScrollbarCuoi()
        setClickedMessageFeedBackOb(messageId);
    }
    const [showMember, setShowMember] = useState(false)
    
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
    const settingUsers = (data) => {
        if (data.creator.email === user.email) {
            return data.recipient;
        } else {
            return data.creator;
        }
    }    
    const [inforMember, setInforMember] = useState(undefined)

    const [searchValue, setSearchValue] = useState('');
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };
    const filteredFriends = friendsGroup.filter(m => {
        return settingUsers(m).fullName.toLowerCase().includes(searchValue.toLowerCase());
    });
    // kick grouos
    const onClickKick = (id) => {
        const data = {
            idGroups: group._id,
            idUserKick: id,
        }
        kickGroups(data)
        .then((res) => {
            if (res.data.groupsUpdate) {
                const data1 = {
                    content: `Đã mời ${res.data.userKicked} ra khỏi nhóm`,
                    groupsID: res.data.groupsUpdate._id,
                };
                createMessagesGroup(data1)
                .then((res) => {
                    setTexting("");
                    ScrollbarCuoi();
                    if (res.data.status === 400) {
                        // alert("Hiện tại bạn không còn trong nhóm này")
                        setErrorMessage('Hiện tại bạn không còn trong nhóm này')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
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
                        setErrorMessage('Lỗi Server')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                        window.location.reload();
                    }


                })
            } else {
            //    alert('Kick thành viên không thành công') 
            setErrorMessage('Kick thành viên không thành công')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            }
            
        })
        .catch((err) => {
            console.log(err);
            // alert("Lỗi hệ thống")
            setErrorMessage('Lỗi hệ thống')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
        })
    }
    const onClickFranchise = (id) => {
        const data = {
            idGroups: group._id,
            idUserFranchise: id,
        }
        franchiseGroups(data)
        .then((res) => {
            if (res.data.groupsUpdate) {
                const data1 = {
                    content: `Đã nhường chức chủ phòng lại cho ${res.data.userCreatorNew} `,
                    groupsID: res.data.groupsUpdate._id,
                };
                createMessagesGroup(data1)
                .then((res) => {
                    setTexting("");
                    ScrollbarCuoi();
                    if (res.data.status === 400) {
                        // alert("Hiện tại bạn không còn trong nhóm này")
                        setErrorMessage('Hiện tại bạn không còn trong nhóm này')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
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
                        setErrorMessage('Lỗi Server')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                        window.location.reload();
                    }


                })
            } else {
            //    alert('Nhượng quyền không thành công') 
            setErrorMessage('Nhượng quyền không thành công')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            }
            
        })
        .catch((err) => {
            console.log(err);
            // alert("Lỗi hệ thống")
            setErrorMessage('Lỗi hệ thống')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
        })
    }
    const [nameGroup, setNameGroup] = useState('')
    const handleUpdateInf = (e) => {
        setNameGroup(e.target.value);
    };
    const [tam,setTam]=useState()
    const refUpdateInf = useRef(null)
    const [filePath,setFilePath]=useState([])
    const [updateImageGroup, setUpdateImageGroup] = useState()
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const files = event.target.files;
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setTam(reader.result)
                setFilePath(files)
            };
            reader.readAsDataURL(file);
        } else {
            // alert("Vui lòng chọn một tập tin ảnh.");
            setErrorMessage('Vui lòng chọn một tập tin ảnh')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
        }
    };
    // update Group
    const updateInfoGroups = () => {
        if(filePath.length > 0)
        {
            const formData = new FormData();
            formData.append('file', filePath[0]);
            createMessagesFile(formData)
            .then((resFile) => {
                const data = {
                    idGroups: group._id,
                    nameGroups: nameGroup,
                    avtGroups: resFile.data,
                }
                updateGroups(data)
                .then((res) => {
                    setFilePath([]);
                    // alert("Cập nhật thành nhóm thành công")
                    setLoi(true);
                    setErrorMessage('Cập nhật thành nhóm thành công')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                        const data1 = {
                            content:  `${user.fullName} vừa cập nhật thông tin phòng`,
                            groupsID: group._id,
                        };
                      createMessagesGroup(data1)
                            .then((res) => {
                                setTexting("");
                                setSendFile([]);
                                ScrollbarCuoi();
                                if (res.data.status === 400) {
                                    // alert("Hiện tại bạn không còn trong nhóm này")
                                    setErrorMessage('Hiện tại bạn không còn trong nhóm này')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
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
                                    setErrorMessage('Lỗi Server')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                                    window.location.reload();
                                }


                            })
                    
                })
                .catch((err) => {
                    console.log(err);
                    // alert("Lỗi cập nhật groups")
                    setErrorMessage('Lỗi cập nhật groups')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                })
            })
            .catch(error => {
                console.log(error);
                // alert("Lỗi up ảnh")
                setErrorMessage('Lỗi up ảnh')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            })

        } else {
            const data = {
                idGroups: group._id,
                nameGroups: nameGroup,
            }
            updateGroups(data)
            .then((res) => {
                // alert("Cập nhật thành nhóm thành công")
                setLoi(true)
                setErrorMessage('Cập nhật thành nhóm thành công')
                setShowErrorModal(true)
                setTimeout(() => {
                    setShowErrorModal(false)
                }, 2000);
                const data1 = {
                    content:  `${user.fullName} vừa cập nhật thông tin phòng`,
                    groupsID: group._id,
                };
              createMessagesGroup(data1)
                    .then((res) => {
                        setTexting("");
                        setSendFile([]);
                        ScrollbarCuoi();
                        if (res.data.status === 400) {
                            // alert("Hiện tại bạn không còn trong nhóm này")
                            setErrorMessage('Hiện tại bạn không còn trong nhóm này')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
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
                            setErrorMessage('Lỗi Server')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
                            window.location.reload();
                        }


                    })
            })
            .catch((err) => {
                console.log(err);
                // alert("Lỗi cập nhật groups 2")
                setErrorMessage('Lỗi cập nhật groups 2')
            setShowErrorModal(true)
            setTimeout(() => {
                setShowErrorModal(false)
            }, 2000);
            })
        }
       
       
    }
    const clickOpenUpdate = () => {
        if (refUpdateInf.current.style.display === 'none') {

            refUpdateInf.current.style.display = 'flex';
        } else {

            refUpdateInf.current.style.display = 'none';
        }
    };
    const clickCloseUpdate = () => {
        setTam(group.avtGroups)
        refUpdateInf.current.style.display = 'none';

    };
    const handlerCallGroup = () => {
        const dataCall = {
            idGroups: group._id,
            userCall: user,
        }
        socket.emit(`userCallGroup`, dataCall)
    }
    const handleCancleCallGroups = () => {
        const dataCancleCall = {
            idGroups: group._id,
            userCancel: user,
        }
        socket.emit(`cancelCallGroup`, dataCancleCall)
    }
    const existCallGroup = () => {
        const dataCancleCall = {
            idGroups: group._id,
            userCancel: user,
        }
        socket.emit(`cancelCallGroup`, dataCancleCall)
    }
    return (
        <div className='baoquat'>
            {group !== undefined ? (
            <div className='baoqua'>
                <div className='section-three' ref={thuNhoBaRef}>
                    <div className='title' >
                        <div className='title-tt'>
                             <div onClick={handleButtonClickF} style={{ position: 'relative', width: '60px', height: '60px', marginLeft: "5px" }}>


                            <img src={updateImageGroup} alt="" style={{ width: '100%', height: "100%", borderRadius: '50%' }} />


                            </div>
                            {/* <img src={'https://th.bing.com/th/id/OIP.avb9nDfw3kq7NOoP0grM4wHaEK?rs=1&pid=ImgDetMain'} alt="" style={{ width: '50px', borderRadius: "50px", marginLeft: "5px" }} /> */}
                            <div className='inf-title'>
                                <span className='name-title'>{setTingNameGroups(group)}</span> {/*  */}
                                <div className='member'>

                                    <i className='bx bxs-group'>{participants.length + 1} member</i>

                                </div>
                            </div>
                        </div>
                        <div className='icon'>
                            <i className='bx bx-user-plus' onClick={handAddMember} ></i>
                            <i className='bx bx-camera-movie' onClick={handlerCallGroup}></i>
                            <i className='bx bx-menu' onClick={handleButtonClick} style={{ cursor: 'pointer' }}></i>
                        </div>
                    </div>

                    <div className='inf-mess' ref={messRef}>

                        {messagesGroups.map((m) => (
                            <div key={m._id} className={`m ${m.author?.email === user.email ? 'mess-me' : 'mess-you'}`} onMouseLeave={handleMouseLeave} >
                                <img src={m.author.avatar} alt="" style={{ width: '50px',height:'50px', borderRadius: "50px" }} />
                                <div className='inf-you' onMouseEnter={() => handleMouseEnter(m._id)}>
                                    <div className='tt'>
                                        <span>{m.author.fullName}</span>
                                        <span>{timeChat(m.createdAt)}</span>
                                    </div>
                                    {m.answerMessage!== undefined &&   
                                    <div style={{ background: '#f4f4f4', padding: '5px', maxWidth: '350px', borderRadius: '5px' }}>
                                            <div style={{ fontSize: '10px' }}>Trả lời :{m.answerMessage.fullName}</div>
                                            <div style={{ fontSize: '13px', maxWidth: '350px', wordBreak: 'break-word', color: '#666' }}>{checkAnswerMessage(m.answerMessage.content)}</div>
                                        </div>  }
                                  
                                    <div className='content'>
                                        {SendToMesageImage(messageRemoved(m.content))}
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
                                </div>
                             
                                {hoveredMessage === m._id && (
                                 
                                    <div style={{ display: 'flex', marginTop: '5px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0.1, 0.1, 0.1, 0.1)' }}>

                                    <i className='bx bxs-tag-x' style={{ height: '20px', width: '20px', margin: '10px', color: '#333', borderRadius: '5px', cursor: 'pointer', fontSize: '15px' }} onMouseOver={(e) => { e.target.style.backgroundColor ='#f0f0f0'; }} onMouseOut={(e) => { e.target.style.backgroundColor = 'white'; }}  onClick={() => handleDelete(m._id)}></i>
                                    <i className='bx bx-revision' style={{ height: '20px', width: '20px', margin: '10px', color: '#333', borderRadius: '5px', cursor: 'pointer', fontSize: '15px' }} onMouseOver={(e) => { e.target.style.backgroundColor = '#f0f0f0'; }} onMouseOut={(e) => { e.target.style.backgroundColor = 'white'; }} onClick={() => handleUndo(m._id)}></i>
                                    <i className='bx bx-subdirectory-left' style={{ height: '20px', width: '20px', margin: '10px', color: '#333', borderRadius: '5px', cursor: 'pointer', fontSize: '15px' }} onClick={() => handleFeedBackOb(m)} onMouseOver={(e) => { e.target.style.backgroundColor = 'white'; }} onMouseOut={(e) => { e.target.style.backgroundColor = '#f0f0f0'; }}></i>
                                </div>
                                )}
                                {/* {changeText === m._id && (
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
                {inforMember !== undefined && (<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                        <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)', padding: '20px', width: '400px' }}>
                            <h3 style={{ fontSize: '24px', marginBottom: '20px', position: 'relative' }}>
                                Personal Information
                                <button className='btn-off' onClick={() => setInforMember(undefined)} style={{ position: 'absolute', top: '5px', right: '5px', border: 'none', background: 'none', cursor: 'pointer' }}>
                                    <i className='bx bx-x' style={{ fontSize: '24px', color: '#333' }}></i>
                                </button>
                            </h3>
                            <img src={inforMember.background} alt="" style={{ width: '400px', height: '140px', borderRadius: '8px', marginBottom: '20px' }} />
                            <div className='image-name' style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <img src={inforMember.avatar} alt="" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #333', marginRight: '20px' }} />
                                <span id='name' style={{ fontSize: '20px', fontWeight: 'bold' }}>{inforMember.fullName}</span>
                            </div>
                            <div className='infor'>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Gender:</label>
                                    <span id='gender' style={{ marginLeft: '10px' }}>{inforMember.gender}</span>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Date of Birth:</label>
                                    <span id='birthday' style={{ marginLeft: '10px' }}>{inforMember.dateOfBirth}</span>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Email:</label>
                                    <span id='email' style={{ marginLeft: '10px' }}>{inforMember.email}</span>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Phone Number:</label>
                                    <span id='phone' style={{ marginLeft: '10px' }}>{inforMember.phoneNumber}</span>
                                </div>
                            </div>

                        </div>
                    </div>)}

                <div ref={formRefAddMember} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'none', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                        <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)', width: '400px', height: '500px', position: 'relative' }}>
                            <h3 style={{ fontSize: '15px', marginBottom: '20px', position: 'relative', borderBottom: '1px solid black', padding: '10px' }}>
                                Add Member
                                <button className='btn-off' onClick={btnCloseAddMember} style={{ position: 'absolute', top: '5px', right: '5px', border: 'none', background: 'none', cursor: 'pointer' }}>
                                    <i className='bx bx-x' style={{ fontSize: '24px', color: '#333' }}></i>
                                </button>
                            </h3>
                            <input type="text" placeholder="Nhập tên vào đây.." style={{ fontSize: '15px', border: '2px solid #ccc', borderRadius: '10px', padding: '8px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', transition: 'border-color 0.3s ease', width: '80%', outline: 'none', marginLeft: '8%' }}
                                onFocus={(e) => { e.target.style.borderColor = '#E99D49'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#ccc'; }}
                                onChange={handleSearchChange}
                            />
                            <div style={{ overflowY: 'scroll', scrollbarWidth: 'auto', height: '300px', border: '2px solid #ccc', marginTop: '10px' }}>
                                {filteredFriends.map(m => (
                                    <div key={m._id} style={{
                                        marginBottom: '10px', display: 'flex', marginTop: '10px', alignItems: 'center', fontSize: '22px'
                                    }}>
                                        <input
                                            type="checkbox"
                                            value={settingUsers(m).phoneNumber}
                                            style={{ marginRight: '5px', alignContent: 'center', justifyContent: 'center' }}
                                            onChange={handleCheckboxChange}
                                            checked={selectedItems.includes(settingUsers(m).phoneNumber)}
                                            disabled={joinedFriends.includes(settingUsers(m).phoneNumber)}
                                        />
                                        <img src={settingUsers(m).avatar} width="30px" height="30px" style={{ borderRadius: '50%', padding: '0 10px' }} />
                                        <div>
                                            <div>{settingUsers(m).fullName}</div>
                                            {joinedFriends.includes(settingUsers(m).phoneNumber) && <div style={{ fontSize: '10px', color: 'orange' }}>Đã tham gia</div>}
                                        </div>
                                    </div>
                                ))}

                            </div>
                            <div style={{ position: 'absolute', bottom: '5%', right: '5%' }}>
                                <button
                                    onClick={btnCloseAddMember}
                                    style={{ marginRight: '10px', padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#f4f4f4', color: 'black', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} > Hủy </button>
                                <button onClick={addMember} style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#FFA500', color: 'white', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease', }} onMouseOver={(e) => { e.target.style.backgroundColor = 'black'; }} onMouseOut={(e) => { e.target.style.backgroundColor = '#FFA500'; }}>Thêm</button>
                            </div>
                        </div>
                    </div>
                    <div ref={refUpdateInf} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'none', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                        <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)', width: '400px', height: '400px', position: 'relative' }}>
                            <h3 style={{ fontSize: '15px', marginBottom: '20px', position: 'relative', borderBottom: '1px solid black', padding: '10px' }}>
                                Update Information
                                <button className='btn-off' style={{ position: 'absolute', top: '5px', right: '5px', border: 'none', background: 'none', cursor: 'pointer' }}>
                                    <i className='bx bx-x' onClick={clickCloseUpdate} style={{ fontSize: '24px', color: '#333' }}></i>
                                </button>
                            </h3>
                            <div style={{ display: "flex", alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                               <img style={{ width: '80px', height: '80px', borderRadius: '50%', border: '1px solid black', marginRight: '10px' }} src={tam} alt="Preview" />

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{
                                        backgroundColor: "#ffbd82",
                                        color: "white",
                                        padding: "10px 20px",
                                        borderRadius: "5px",
                                        border: "none",
                                        cursor: "pointer",
                                        outline: "none",
                                        width: '200px'

                                    }}
                                />
                            </div>

                            <input onChange={handleUpdateInf} type="text" placeholder="Nhập tên vào đây.." style={{ fontSize: '15px', border: '2px solid #ccc', borderRadius: '10px', padding: '8px', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', transition: 'border-color 0.3s ease', width: '80%', outline: 'none', marginLeft: '8%' }} value={nameGroup}
                                onFocus={(e) => { e.target.style.borderColor = '#E99D49'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#ccc'; }}
                            />
                            <div style={{ position: 'absolute', bottom: '5%', right: '5%' }}>
                                <button style={{ marginRight: '10px', padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#f4f4f4', color: 'black', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onClick={clickCloseUpdate} > Hủy </button>
                                <button onClick={updateInfoGroups} style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#FFA500', color: 'white', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease', }} onMouseOver={(e) => { e.target.style.backgroundColor = 'black'; }} onMouseOut={(e) => { e.target.style.backgroundColor = '#FFA500'; }}>Update</button>
                            </div>
                        </div>
                    </div>
                    <div id='myFormInformation' ref={formRefF} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'none', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                        <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)', padding: '20px', width: '400px', height: '500px' }}>
                            <div style={{ fontSize: '20px', marginBottom: '20px', position: 'relative', borderBottom: '1px solid black', paddingBottom: '10px' }}>
                                Thông tin nhóm
                                <button className='btn-off' onClick={btnClose} style={{ position: 'absolute', top: '5px', right: '5px', border: 'none', background: 'none', cursor: 'pointer' }}>
                                    <i className='bx bx-x' style={{ fontSize: '24px', color: '#333' }}></i>
                                </button>
                            </div>

                            <div className='image-name' style={{ alignItems: 'center', marginBottom: '20px', position: 'relative', display: 'flex', background: 'linear-gradient(133deg, #eaaa89 30%, #ffbd82)', padding: '20px', borderRadius: '10px' }}>

                                <div style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '50%', background: ' #f4f4f4' }}>

                                    <img src={updateImageGroup} alt="" style={{ width: '100%', height: "100%", borderRadius: '50%' }} />


                                    {/* sua  //////////////////////////////976 978 */}
                                    {/* <i className='bx bx-camera' style={{ padding: '5px', position: 'absolute', zIndex: '10', borderRadius: '50%', background: '#f4f4f4', fontSize: '20px', bottom: '-5px', right: '-5px' }}></i> */}
                                </div>
                                <span id='name' style={{ paddingLeft: '5%', fontSize: '20px', fontWeight: 'bold' }}>{nameOfGroups} </span>
                            </div>
                            <label style={{marginBottom: '10px'}} >Member({participants.length})</label>
                            <div className='infor'>
                            
                                <div style={{ marginBottom: '20px' }}>
                                    
                                    <div style={{ display: 'flex', paddingTop: '10px', flexDirection: "column", justifyContent: "center", overflowY: 'auto', height: '200px' }}>
                                           
                                        <div className="memberInGroup" style={{display: 'flex', alignItems: 'center', position: "relative"}}>
                                            <img src={creatorGroup.avatar}
                                                alt=""
                                                style={{
                                                    width: "25px",
                                                    height: "25px",
                                                    borderRadius: "50%"
                                                }}
                                            />
                                            <p style={{marginLeft: "5px"}}> {creatorGroup.fullName}</p>
                                            <img
                                                src={keyImage}
                                                alt=""
                                                style={{
                                                    width: "25px",
                                                    height: "25px",
                                                    borderRadius: "50%",
                                                    position: "absolute",
                                                    right: 0
                                                }}
                                            />
                                        </div>
                                    {participants.map((m) => ( 
                                        <div className="memberInGroup" key={m._id} style={{display: 'flex', alignItems: 'center'}}>
                                            <img src={m.avatar}
                                                alt=""
                                                style={{
                                                    width: "25px",
                                                    height: "25px",
                                                    borderRadius: "50%"
                                                }}
                                            />
                                            <p style={{marginLeft: "5px"}}> {m.fullName}</p>
                                            
                                              </div>
                                    ))}
                                    </div>
                                </div>
                                <div key={group._id} className={leader ? 'thaotac-one' : ''} style={leader ? {} : { marginBottom: '10px' }}>
                                    <i className='bx bx-exit' style={{ color: 'red', fontSize: '20px', marginRight: '10px' }} onClick={handleExitRom}>
                                        {leader ? 'Giải tán nhóm' : 'Rời khỏi nhóm'}
                                    </i>
                                </div>
                            </div>

                        </div>
                    </div>
                    {showErrorModal && <ModalError message={errorMessage} onClose={handleCloseErrorModal} />}
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
              
                    <div className='section-four-cro'>
                        <div className='title'>
                            <h3>Thông tin</h3>
                        </div>
                        <div className='avt'>
                            <img src={updateImageGroup} alt="" style={{ width: '70px',height:'70px', borderRadius: "50px" }} />
                        </div>
                        <div className='inf'>
                            <p>{setTingNameGroups(group)}</p>
                            <i className='bx bx-edit-alt' onClick={() => { clickOpenUpdate(); setNameGroup(setTingNameGroups(group)); }}></i>
                        </div>

                        <div className='thaotac' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div className='thaotac-one'>
                                    <i className='bx bx-group' onClick={handAddMember} ></i>
                                    <span style={{ fontSize: '11px' }}>Thêm thành viên </span>
                                </div>
                                <div className='thaotac-one' style={{ marginLeft: '15px' }} onClick={handleLeaveGroup}>
                                    <i className='bx bxs-coffee-togo'></i>
                                    <span style={{ fontSize: '11px' }}>Rời nhóm</span>
                                </div>
                                {leader && (<div key={group._id} className='thaotac-one'>
                                    <i className='bx bx-subdirectory-right' onClick={handleDissolution}></i>
                                    <span style={{ marginLeft: '10px', fontSize: '11px' }}>Giải tán</span>
                                </div>)}

                        </div>
                       <div>
                        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
                                    <img onClick={() => setInforMember(creatorGroup)} src={creatorGroup.avatar} alt="" style={{ width: '40px', height: "40px", borderRadius: '50%', padding: '10px 15px 10px 15px' }} />
                                    <span>{creatorGroup.fullName}        </span>
                                    <img
                                        src={keyImage}
                                        alt=""
                                        style={{
                                            width: "25px",
                                            height: "25px",
                                            borderRadius: "50%",
                                        }}
                                    />
                                </div>
                                {participants.map((participant, index) => (
                                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative', borderBottom: index !== participants.length - 1 ? "1px solid #ccc" : "none" }} key={participant._id}>
                                        <img onClick={() => setInforMember(participant)} src={participant.avatar} alt="" style={{ width: '40px', height: "40px", borderRadius: '50%', padding: '10px 15px 10px 15px' }} />
                                        <span>{participant.fullName}</span>
                                        {creatorGroup._id === user._id &&
                                            <div style={{ position: 'absolute', right: '2%' }}>
                                                <div style={{cursor: 'pointer'}} onClick={() => setSelectedId(selectedId === participant._id ? null : participant._id)}>...</div>
                                                {selectedId === participant._id &&
                                                    <div ref={menuRef} style={{ position: 'absolute', right: '2%', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px', boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)', zIndex: 1 }}>
                                                        <div onClick={() => onClickKick(participant._id)} style={{ color: 'red', fontSize: '12px', marginBottom: '10px', cursor: 'pointer' }}>Kick</div>
                                                        <div onClick={() => onClickFranchise(participant._id)} style={{ color: 'red', fontSize: '12px', cursor: 'pointer' }}>Franchise</div>
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                ))}
                        </div>
                        
                        
                    </div>
                </div>
                {videoCallGroups && (<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', width: '400px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                        <div className='titleadd' style={{ borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px', position: 'relative' }}>
                            <h2 style={{ fontSize: '15px', color: '#333', textAlign: 'center', marginBottom: '10px' }}>Đang gọi</h2>
                            <i className='bx bx-x' style={{ cursor: 'pointer', fontSize: '25px', position: 'absolute', right: '0', top: '0' }} onClick={existCallGroup}></i>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                            <img src={updateImageGroup} alt="" style={{ width: '75px', height: '75px', borderRadius: '50%', margin: '10px' }} />
                            <div style={{ fontSize: '18px' }}>Đang gọi cho nhóm {nameOfGroups}</div>
                        </div>



                        <div className='endAdd' style={{ display: 'flex', justifyContent: 'space-around' }}>

                            <i className='bx bxs-phone-incoming' onClick={handleCancleCallGroups} style={{ backgroundColor: 'red', color: 'white', padding: '12px', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '25px', transition: 'background-color 0.3s' }}></i>

                        </div>
                </div>
                </div>)}
            </div>
          ) : (<div>
        <div style={{ fontSize: '50px', padding: '50px' }}> <span style={{ animation: 'bouncel2 1s' }}>W</span><span style={{ animation: 'bouncel2 1.2s' }}>e</span><span style={{ animation: 'bouncel2 1.4s' }}>l</span><span style={{ animation: 'bouncel2 1.6s' }}>c</span><span style={{ animation: 'bouncel2 1.8s' }}>o</span><span style={{ animation: 'bouncel2 2s' }}>m</span><span style={{ animation: 'bouncel2 2.2s' }}>e</span></div>
        <div style={{ fontSize: '120px', color: ' rgb(240, 143, 23)', paddingLeft: '200px' }}><span style={{ animation: 'bouncel2 2.4s' }}>Z</span><span style={{ animation: 'bouncel2 2.6s' }}>e</span><span style={{ animation: 'bouncel2 2.8s' }}>n</span><span style={{ animation: 'bouncel2 3s' }}>C</span><span style={{ animation: 'bouncel2 3.2s' }}>h</span><span style={{ animation: 'bouncel2 3.4s' }}>a</span><span style={{ animation: 'bouncel2 3.6s' }}>t</span> </div>
        </div>)} 


        </div>
        
    )
    
}

export default MessGroup 