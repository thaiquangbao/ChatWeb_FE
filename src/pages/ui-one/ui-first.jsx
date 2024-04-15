import React, { useRef, useState, useContext, useEffect } from 'react'
import './ui.scss'
import Item from '../../component/item-mess/item'
import { AuthContext } from '../../untills/context/AuthContext'
import { Link, useNavigate } from 'react-router-dom';
import { Mess } from './component/mess';
import { getListRooms,createGroups ,logoutUser, removeCookie, sendFriends, createRooms, createMessagesGroup ,getListGroups } from '../../untills/api';
import { SocketContext } from '../../untills/context/SocketContext';
import { useUser } from './component/findUser'
import ItemGroup from '../../component/item-mess-group/itemGroup';
import MessGroup from './component/messGroup';
import ErrorMicroInteraction from './giphy.gif';
import SuccessMicroInteraction from './Success Micro-interaction.gif';
export const UiFirst = () => {
    const [isActive, setIsActive] = useState(false); // Cảm giác nút bấm
    const [isLoading, setIsLoading] = useState(false); // modal loading xoay xoay
    const [idAccept, setIdAccept] = useState();
    const [recipient, setRecipient] = useState();
    const [sender, setSender] = useState();
    const [reciever, setReciever] = useState();



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
    const [backgroud, setBackgroud] = useState();
    const socket = useContext(SocketContext);
    const [searchValue, setSearchValue] = useState('');
    const [showLogout, setShowLogout] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const { handleFindUser } = useUser();
    const [authFound, setAuthFound] = useState([]);
    const [friend, setFriend] = useState();
    const [gender, setGender] = useState();
    const [email, setEmail] = useState();
    const [sdt, setSdt] = useState();
    const [dateBirth, setDateBirth] = useState();
    const [pageGroup, setPageGroup] = useState(false)
    const [groups, setGroups] = useState([]);
    const [idGroups, setIdGroups] = useState();
    const [friendCreateGroup, setFriendCreateGroup] = useState([]);
    // console.log(newMessage === true);
    // if (newMessage === true) {
    //     socket.on('getRooms', updatedRooms => {
    //         console.log(updatedRooms);
    //         setRooms(preRooms => [...preRooms, updatedRooms])
    //     })
    // }

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
    const setTingNameGroups = (group) => {
        if (group.nameGroups === '') {
            return `Groups của ${group.creator.fullName}`
        } else {
            return group.nameGroups;
        }
    }
    const settingUsers = (data) => {
        if (data.creator.email === user.email) {
            return data.recipient;
        } else {
            return data.creator;
        }
    }
    const handleAddClick = () => {
        const message = "hello"
        const authen = [authFound[0].email]
        const email = authen[0]
        const data1 = { email, message }

        createRooms(data1)
            .then(res => {
                if (res.data.message === "Đã tạo phòng với User này ròi") {
                    // alert("Đã tạo phòng với User này ròi !!!");
                    setErrorMessage('Đã kết bạn với user này rồi.');
                    setShowErrorModal(true); // Hiển thị modal error

                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
                    return;
                }
                if (res.data.status === 400) {
                    // alert("Không thể nhắn tin với chính bản thân mình !!!");
                    setLoi(false)
                    setErrorMessage('Không thể nhắn tin với chính bản thân mình !!!');
                    setShowErrorModal(true); // Hiển thị modal error

                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
                    return;
                }
                else {
                    // window.location.reload();
                    const idFriend = {
                        id: res.data.recipient._id
                    }
                    sendFriends(idFriend)
                    .then((userRes) => {
                        if(userRes.data){
                            formRef.current.style.display = 'none';
                            setLoi(true)

                                setErrorMessage('Gửi lời mời kết bạn thành công');
                                setShowErrorModal(true); // Hiển thị modal error
                                // alert("Gửi lời mời kết bạn không thành công");

                                setTimeout(() => {
                                    setShowErrorModal(false);
                                }, 2000);
                            
                            return;
                        }
                        else {
                            setErrorMessage('Gửi lời mời kết bạn không thành công');
                                setShowErrorModal(true); // Hiển thị modal error
                                // alert("Gửi lời mời kết bạn không thành công");

                                setTimeout(() => {
                                    setShowErrorModal(false);
                                }, 2000);
                            return;
                        }
                    })
                    .catch((error) => {
                        setErrorMessage('Lỗi hệ thống');
                        setShowErrorModal(true); // Hiển thị modal error

                        setTimeout(() => {
                            setShowErrorModal(false);
                        }, 2000);
                    })
                    
                }
            })
            .catch(err => {
                setErrorMessage('Lỗi hệ thống');
                setShowErrorModal(true); // Hiển thị modal error

                setTimeout(() => {
                    setShowErrorModal(false);
                }, 2000);
            })
            setPhoneNumber('')
            setAuthFound([])
    };
    const updateRoomFriend = (newRooms) => {
        setRooms(prevRooms => {
            // Cập nhật phòng đã được cập nhật
            return prevRooms.map(room => {
                if (room._id === newRooms._id) {
                    return newRooms;
                }
                return room;
            });
        });  
    }
    // const updateLastMessageGroupss = (updateGroups) => {
    //     return setGroups(preGroups => {
    //         preGroups.map(item => {
    //             if (item === undefined || updateGroups === undefined) {
    //                 return item;
    //             }
    //             if (item._id === updateGroups._id) {
    //                 console.log(item);
    //                 return updateGroups;
    //             }
    //             return item;
    //         })
    //     })
    // }
    // const updateLastMessageGroup = (updateGroups) => {
    //     return setGroups(preGroups => [
    //         preGroups.map(item => {
    //             if (item === undefined || updateGroups === undefined) {
    //                 return item;
    //             }
    //             if (item._id === updateGroups._id) {
    //                 console.log(item);
    //                 return updateGroups;
    //             }
    //             return item;
    //         })
    //     ])
    // }
    const updateListRooms = (updatedRoom) => {
        setRooms(prevRooms => {
            // Cập nhật phòng đã được cập nhật
            return prevRooms.map(room => {
                if (room === undefined || updatedRoom === undefined) {
                    return room;
                }
                if (room._id === updatedRoom._id) {
                    console.log(updatedRoom.lastMessageSent.content);
                    return updatedRoom;
                }
                return room;
            });
        });
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
    useEffect(() => {
        socket.on('connected', () => console.log('Connected'));
        socket.on(user.email, roomSocket => {
            setRooms(prevRooms => [...prevRooms, roomSocket]);

        })
        socket.on(user.email, roomSocket => {
            updateListRooms(roomSocket.rooms)
        });
        socket.on(`createGroups${user.email}`, data => {
            setGroups(prevGroups => [...prevGroups, data])
        })
        socket.on(`deleteGroups${user.email}`, data => {
            setGroups(prevGroups => {
                    return prevGroups.filter(item => item._id !== data._id)
            })
        })
        socket.on(`leaveGroups${user.email}`, data => {
            if (data.userLeave === user.email) {
                 setGroups(prevGroups => {
                    return prevGroups.filter(item => item._id !== data.groupsUpdate._id)
                })
            } else {
                setGroups(prevGroups => {
                    const updatedGroups = prevGroups.map(room => {
                        if (room === undefined || data.groupsUpdate=== undefined) {
                            return room;
                        }
                        if (room._id === data.groupsUpdate._id) {
                            return data.groupsUpdate;
                        }
                        return room;
                    });
                    return updatedGroups;
                })
            }
           
        })
        socket.on(`unfriends${user.email}`, data => {
            if (data.reload === false) {
                setRooms(prevRooms => {
                    // Cập nhật phòng đã được cập nhật
                    return prevRooms.filter(item => item._id !== data.roomsUpdate)
                });  
                navigate('/page');
            }
            else {
                // alert(`Người dùng ${data.emailUserActions} đã hủy kết bạn`)
                setErrorMessage(`Người dùng ${data.emailUserActions} đã hủy kết bạn`);
                setShowErrorModal(true); // Hiển thị modal error

                setTimeout(() => {
                    setShowErrorModal(false);
                }, 2000);
                setRooms(prevRooms => {
                    // Cập nhật phòng đã được cập nhật
                   return prevRooms.filter(item => item._id !== data.roomsUpdate)
                }); 
                navigate('/page');
            }
        })
        socket.on(`undo${user.email}`, data => {
            setRooms(prevRooms => {
                // Cập nhật phòng đã được cập nhật
               return prevRooms.filter(item => item._id !== data.roomsUpdate)
            }); 
            navigate('/page');
        })
        socket.on(`createMessageGroups${user.email}`, (data) => {
            setGroups(prevGroups => {
                // Xóa nhóm cũ có cùng ID (nếu có) và thêm nhóm mới từ dữ liệu socket
                const filteredGroups = prevGroups.filter(item => item._id !== data.groups._id);
                return [data.groups, ...filteredGroups];
            });
        })
        socket.on(`deleteLastMessagesGroups${user.email}`, (data) => {
            setGroups(prevGroups => {
                // Xóa nhóm cũ có cùng ID (nếu có) và thêm nhóm mới từ dữ liệu socket
                const filteredGroups = prevGroups.filter(item => item._id !== data.groupsUpdate._id);
                return [data.groupsUpdate, ...filteredGroups];
            });
        })
        socket.on(`recallLastMessagesGroups${user.email}`, (data) => {
            if (data) {
                setGroups(prevGroups => {
                    const updatedGroups = prevGroups.map(room => {
                        if (room === undefined || data.groupsUpdate=== undefined) {
                            return room;
                        }
                        if (room._id === data.groupsUpdate._id) {
                            return data.groupsUpdate;
                        }
                        return room;
                    });
                    return updatedGroups;
                })
            }
            
        })
        socket.on(`attendMessagesGroup${user.email}`, (data) => {
            if (data) {
                setGroups(prevGroups => {
                    const updatedGroups = prevGroups.map(room => {
                        if (room === undefined || data.groupsUpdate=== undefined) {
                            return room;
                        }
                        if (room._id === data.groupsUpdate._id) {
                            return data.groupsUpdate;
                        }
                        return room;
                    });
                    return updatedGroups;
                })
            }
        })
        socket.on(`attendMessagesGroupsss${user.email}`, (data) => {
            if (data) {
                setGroups(prevGroups =>[data.groupsUpdate, ...prevGroups])
            }
        })
        socket.on(`feedBackLastMessagesGroup${user.email}`, (data) => {
            setGroups(prevGroups => {
                // Xóa nhóm cũ có cùng ID (nếu có) và thêm nhóm mới từ dữ liệu socket
                const filteredGroups = prevGroups.filter(item => item._id !== data.groups._id);
                return [data.groups, ...filteredGroups];
            });
        })
        socket.on(`updateKickGroup${user.email}`, data => {
            console.log(data);
            if (data.userKicked === user.email) {
                console.log(`Đã rơi vào 1 ${data.groupsUpdate._id}`);
                 setGroups(prevGroups => {
                    return prevGroups.filter(item => item._id !== data.groupsUpdate._id)
                })
            } else {
                console.log(`Đã rơi vào 2 ${data.groupsUpdate._id}`);
                setGroups(prevGroups => {
                    const updatedGroups = prevGroups.map(room => {
                        if (room === undefined || data.groupsUpdate=== undefined) {
                            return room;
                        }
                        if (room._id === data.groupsUpdate._id) {
                            return data.groupsUpdate;
                        }
                        return room;
                    });
                    return updatedGroups;
                })
            }
           
        })
        return () => {
            socket.off('connected');
            socket.off(user.email);
            socket.off(user.email)
            socket.off(`createGroups${user.email}`)
            socket.off(`deleteGroups${user.email}`)
            socket.off(`leaveGroups${user.email}`)
            socket.off(`unfriends${user.email}`)
            socket.off(`undo${user.email}`)
            socket.off(`createMessageGroups${user.email}`)
            socket.off(`deleteLastMessagesGroups${user.email}`)
            socket.off(`recallLastMessagesGroups${user.email}`)
            socket.off(`attendMessagesGroup${user.email}`)
            socket.off(`attendMessagesGroupsss${user.email}`)
            socket.off(`feedBackLastMessagesGroup${user.email}`)
            socket.off(`updateKickGroup${user.email}`)
        }
    }, [])
    useEffect(() => {
        socket.on('connected', () => console.log('Connected'));
        socket.emit("onOnline", { user: user });
        return () => {
            socket.off('connected');
            socket.emit("onOffline", { user: user });
           
        }
    }, []);
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
            socket.emit("onOffline", { user: user })
            socket.off(`updateLastMessages${user.email}`)
            socket.off(`updateLastMessagesed${user.email}`)
        }
    }, [])
    
    useEffect(() => {
        socket.on('connected', () => console.log('Connected'));
        socket.on(`updateSendedFriend${user.email}`, roomsU => {
            if (roomsU) {
                setRooms(prevRooms => {
                    // Cập nhật phòng đã được cập nhật
                    return prevRooms.map(room => {
                        if (room._id === roomsU._id) {
                            return roomsU;
                        }
                        
                        return room;
                    });
                });  
                
                updateRoomFriend(roomsU);
                
            }
            
        })
        socket.on(`updateAcceptFriendsGroups${user.email}`, data => {
            if (data) {
                setFriendCreateGroup(prevGroups => [...prevGroups, data])
               
            }
        })
        socket.on(`updateUnFriendsGroups${user.email}`, data => {
            if (data) {
                setFriendCreateGroup(prevGroups => prevGroups.filter(item => item._id !== data.roomsUpdate))
            }
        })
        return () => {
            socket.off('connected');
            socket.off(`updateSendedFriend${user.email}`)
            socket.off(`updateAcceptFriendsGroups${user.email}`)
            socket.off(`updateUnFriendsGroups${user.email}`)
        }
    },[])
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
        if (room.lastMessageSent === undefined || room.lastMessageSent.author === undefined) {

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
    const getDisplayAuthorGroups = (room) => {
        const nullRoll = "";
        if (room.lastMessageSent === undefined || room.lastMessageSent.author === undefined) {

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
        else if (messages.lastMessageSent.content.endsWith('.docx') || messages.lastMessageSent.content.endsWith('.pdf') || messages.lastMessageSent.content.endsWith('.pdf') || messages.lastMessageSent.content.endsWith('.txt') || messages.lastMessageSent.content.endsWith('.xlsx')) {
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
    const getDisplayLastMessagesGroups = (messages) => {
        const message = "";
        if (messages.lastMessageSent === undefined || messages.lastMessageSent.content === undefined) {
            return message;
        }

        else if (messages.lastMessageSent.content.endsWith('.jpg') || messages.lastMessageSent.content.endsWith('.png') || messages.lastMessageSent.content.endsWith('.jpeg') || messages.lastMessageSent.content.endsWith('.gif') || messages.lastMessageSent.content.endsWith('.tiff') || messages.lastMessageSent.content.endsWith('.jpe') || messages.lastMessageSent.content.endsWith('.jxr') || messages.lastMessageSent.content.endsWith('.tif') || messages.lastMessageSent.content.endsWith('.tif')) {
            return "Send image";
        }
        else if (messages.lastMessageSent.content.endsWith('.docx') || messages.lastMessageSent.content.endsWith('.pdf') || messages.lastMessageSent.content.endsWith('.pdf') || messages.lastMessageSent.content.endsWith('.txt') || messages.lastMessageSent.content.endsWith('.xlsx')) {
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
                    // Chỉ setRooms với các object đã được lọc
                    const roomsWithFriends = res.data.filter(room => room.friend === true);
                    // Cập nhật state với các phòng đã lọc
                    setFriendCreateGroup(roomsWithFriends);
           
                })
                .catch(err => {
                    console.log(err);
                    console.log("Đã rơi zô đây");
                })
        }
        fetchData();

    }, [])
    useEffect(() => {
        const fetchData = async () => {
            getListGroups()
                .then(res => {
                    // Chỉ setRooms với các object đã được lọc
                    setGroups(res.data);
               
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
        setPhoneNumber('')
        setAuthFound([])
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
                    // alert("Lỗi hệ thống");
                    setErrorMessage('Lỗi hệ thống')
                    setShowErrorModal(true)
                });
        }, 1500); // Timeout 2 giây
    };

    const handleCancelLogout = () => {
        setShowLogout(false);
    };
    
    const [selectedItems, setSelectedItems] = useState([]);
    const [textNameGroup, setTextNameGroup] = useState('');
// tạo groups
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedItems(prevSelectedItems => [...prevSelectedItems, value]);
        } else {
            setSelectedItems(prevSelectedItems => prevSelectedItems.filter(item => item !== value));
        }
    };
    const handleText = (e) => {
        const texting = e.target.value;
        setTextNameGroup(texting);
    }
    const handleCreateGroup = () => {
        if (textNameGroup === '' || !textNameGroup) {
            alert("Vui lòng điền ten nhóm")
        }else if (selectedItems.length <= 2) {
            alert("Số thành viên phải hơn 2 người")
        } else {
            const data = {
                participants: selectedItems,
                nameGroups: textNameGroup,
            }
            createGroups(data)
            .then((res) => {
                if (res.data.creator.email) {
                    setSelectedItems([]);
                    formRefG.current.style.display = 'none';
                    const data = {
                        content: `${res.data.creator.fullName} đã tạo nhóm`,
                        groupsID: res.data._id,
                    };
                    createMessagesGroup(data)
                        .then((res) => {                       
                            if (res.data.status === 400) {
                                alert("Hiện tại bạn không còn trong nhóm này")
                                window.location.reload();
                            }
                            setTimeout(() => {
                                setIsActive(false); // Tắt hiệu ứng sau một khoảng thời gian
                            }, 300);
                            
                        })
                        .catch((err) => {
                            if (err.status === 400) {
                                alert("Lỗi Server")
                                window.location.reload();
                            }
    
    
                        })
                    alert("Tạo phòng thành công");
                } else {
                    alert("Xóa phòng không thành công")
                }
                
            })
            .catch((err) => {
                console.log(err);
                alert("Lỗi hệ thống")
            })
        }
        
    }
// Nhấn ra Groups
    const handleUnfriendClick = (id) => {
        //console.log(id);
        setPhoneNumber('')
        setAuthFound([])
        formRef.current.style.display = 'none';
    }
    const handleUndoClick = (id) => {
        //console.log(id);
        setPhoneNumber('')
        setAuthFound([])
        formRef.current.style.display = 'none';
    }
    const handleAcceptClick = (id) => {
        //console.log(id);
        setPhoneNumber('')
        setAuthFound([])
        formRef.current.style.display = 'none';
    }

    const testStatus = (auth) => {
        if (auth.friends.some(friend => friend._id === user._id)) {
            return <button onClick={() => handleUnfriendClick(auth._id)} style={{ background: 'rgb(204, 82, 30)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }}>Unfriend</button>
        }
        if (auth.waitAccept.some(friend => friend._id === user._id)) {
            return <button onClick={()=>handleUndoClick(auth._id)} style={{ background: 'rgb(204, 82, 30)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }}>Undo</button>
        }
        if (auth.sendFriend.some(friend => friend._id === user._id)) {
            return <button onClick={() => handleAcceptClick(auth._id)} style={{ background: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }}>Accept</button>
        }
        return <button onClick={handleAddClick} style={{ background: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }}>Add</button>
    }
    return (
        <div className='container'>
                        {showErrorModal && <ModalError message={errorMessage} onClose={handleCloseErrorModal} />}

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
               <img onClick={handleButtonClickTT} src={user.avatar} alt="" style={{borderRadius: "50%", width: '50px', height: '50px'  }} />


                  
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
                <div className='section-two-mess'>
                    <div className='bar-search'>

                        <input type="search" onChange={handleSearchChange} placeholder='search' />
                        <button onClick={handleButtonClick}><i className='bx bx-user-plus' ></i></button>
                        <button onClick={handleButtonClickGroup}><i className='bx bx-group'></i></button>
                        <div style={{ position: 'absolute', left: '0', bottom: '0', display: 'flex' }}>
                            <div style={{ padding: '0 15px 0 15px', color: pageGroup ? 'black' : 'orange', cursor: 'pointer' }} onClick={() => setPageGroup(false)}>Friends</div>
                            <div style={{ color: pageGroup ? 'orange' : 'black', cursor: 'pointer' }} onClick={() => setPageGroup(true)}>Groups</div>
                        </div>
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
                                        {/* <button style={{ background: isAddClicked ? 'rgb(204, 82, 30)' : '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }}>Chat</button> */}
                                        {testStatus(auth)}

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

                    
                    <div id='myFormG' ref={formRefG} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'none', justifyContent: 'center', alignItems: 'center', zIndex: '10' }}>
                        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', width: '500px', height: '500px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)' }}>
                            <h2 style={{ fontSize: '28px', color: '#333', fontWeight: 'bold', marginBottom: '10px', marginBottom: '30px', textAlign: 'center' }}>Add group</h2>
                            <span style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                                <i className='bx bx-image' style={{ marginRight: '10px', fontSize: '30px' }}></i>
                                <input type="text" onChange={handleText} placeholder='Name group' style={{ width: '100%', border: '2px solid #ccc', padding: '12px', borderRadius: '5px', fontSize: '16px', outline: 'none', transition: 'border-color 0.3s' }} />
                            </span>
                            <span style={{ marginBottom: '10px', fontSize: '18px', color: '#555', fontWeight: 'bold' }}>Đã chọn {selectedItems.length}/{friendCreateGroup.length}</span>
                            <div style={{ display: 'flex', alignItems: 'flex-start', borderTop: '1px solid #ccc', border: '1px solid #ccc' }}>
                                <div style={{ flex: 1, overflowY: 'scroll', scrollbarWidth: 'auto', height: '250px' }}>
                                    {friendCreateGroup.map(m => (
                                        <div key={m._id} style={{ marginBottom: '10px', display: 'flex', marginTop: '10px', alignItems: 'center', fontSize: '22px' }}>
                                            <input type="checkbox" value={settingUsers(m).phoneNumber} onChange={handleCheckboxChange} checked={selectedItems.includes(settingUsers(m).phoneNumber)} style={{ marginRight: '5px', alignContent: 'center', justifyContent: 'center' }} /> <img src={settingUsers(m).background} alt="Flag of Vietnam" width="30px" height="30px" style={{ borderRadius: '50%', padding: '0 10px' }} />{settingUsers(m).fullName}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <button onClick={handleButtonDeG} style={{ backgroundColor: '#ccc', color: '#333', padding: '12px 40px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginRight: '10px', transition: 'background-color 0.3s' }}>Cancel</button>
                                <input type="submit" value="Create" style={{ backgroundColor: 'rgb(240, 143, 23)', color: '#fff', padding: '12px 40px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'background-color 0.3s' }} onClick={handleCreateGroup} />
                            </div>
                        </div>
                    </div>
                 
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
                    {pageGroup ? (<div className='list-tt'>
                    {groups.map(group => (
                        <ItemGroup key={group._id} link={group.avtGroups} nameGroup={setTingNameGroups(group)} action={getDisplayLastMessagesGroups(group)} time={'8h'} tt={getDisplayAuthorGroups(group)} onClick={() => {setIdGroups(group)} } />
                    ))}
                        
                    </div>):(   <div className='list-tt'>
                        {SearchRooms.map(room => (
                            <Item key={room._id} link={getDisplayUser(room).avatar} delele={room._id} idd={getDisplayUser(room)._id} name={getDisplayUser(room).fullName} tt={getDisplayAuthor(room)} action={getDisplayLastMessages(room)} time={'3gio'} roomsDelete={room} onClick={() => {
                                setFriend(room.friend)
                                setHomemess(room._id);
                                setAvatar(getDisplayUser(room).avatar);
                                setNameRoom(getDisplayUser(room).fullName)
                                setGender(getDisplayUser(room).gender)
                                setEmail(getDisplayUser(room).email)
                                setSdt(getDisplayUser(room).phoneNumber)
                                setDateBirth(getDisplayUser(room).dateOfBirth)
                                setRecipient(room.recipient.sended)
                                setRecipient(getDisplayUser(room).sended)
                                setSender(room.creator.sended)
                                setReciever(room.recipient.sended)
                                setIdAccept(getDisplayUser(room)._id)
                                setBackgroud(getDisplayUser(room).background)

                            }}
                            
                            setErrorMessage={setErrorMessage}
                                setShowErrorModal={setShowErrorModal}
                             />

                        ))}
                    </div>)}
                 

                </div>
                {pageGroup ? (<MessGroup group={idGroups} />) :(  <Mess id={homemess} nameRoom={nameRoom} avatar={avatar}  updateLastMessage={updateLastMessage} gender={gender} email={email} sdt={sdt} dateBirth={dateBirth} friend={friend} updateRoomFriend={updateRoomFriend} recipient={recipient} idAccept={idAccept} receiver={reciever} sender={sender} background={backgroud}/>)}
              
            </div>
        </div>
    )
}