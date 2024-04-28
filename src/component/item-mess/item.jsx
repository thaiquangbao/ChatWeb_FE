import React, { useState, useContext, useEffect } from 'react'
import './item.scss'
import { AuthContext } from '../../untills/context/AuthContext'
import { deleteRooms, unFriends, acceptFriends, undoFriends } from '../../untills/api'
import { SocketContext } from '../../untills/context/SocketContext';




const friends = {
    undo: 'Undo',
    accept: 'Accept',
    unfriend: 'Unfriend'

}
const Item = ({ link, name, action, time, tt, delele, roomsDelete , onClick,idd, setErrorMessage, setShowErrorModal}) => {
    
    const [isFontWeightOn, setIsFontWeightOn] = useState(false);

    // // Trong hàm xử lý khi người dùng nhấp vào một nút để thay đổi fontWeight
    // const handleFontWeightToggle = () => {
    //     setIsFontWeightOn(!isFontWeightOn); // Đảo ngược giá trị của isFontWeightOn
    //     // Thực hiện các hành động khác nếu cần
    // };


    const [loi, setLoi] = useState(false);
    
    const [mouse, setMouse] = useState(false)
    const [btnForm, setBtnForm] = useState(false)
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [undo, setUndo] = useState(friends.undo);
    const [userInRooms, setUserInRooms] = useState(true);
    const handleLeave = (mm) => {
        setMouse(false)
        setBtnForm(false)
    }
    const mouseEntry = (mm) => {
        setMouse(mm)
     
    }
    const handleBtn = () => {
        setBtnForm(true)
        // setTimeout(() => {
        //     setBtnForm(false)
        // }, 4000);
    }
    const buttonFriend = () => {
        if (user.sendFriend.some(item => item._id === idd)) {
           return setUndo(friends.undo)
        }
        if (user.waitAccept.some(item => item._id === idd)) {
           return setUndo(friends.accept) 
        }
        return setUndo(friends.unfriend)

    }
    // useEffect(() => {
    //     if (userInRooms === false) {
    //         setIsFontWeightOn(isFontWeightOn)
    //     } else {
    //         setIsFontWeightOn(!isFontWeightOn)
    //     }
        
    // }, [tt, action])
    // useEffect(() => {
    //     socket.emit("onRoomJoin", { roomsId: roomsDelete._id })
    //     socket.on(`userJoin${roomsDelete._id}`, () => {
    //         console.log("Người dùng đã tham gia");
    //         setUserInRooms(true); // Đặt userInRooms thành true khi có người tham gia vào phòng
    //         setIsFontWeightOn(!isFontWeightOn)
    //     });
    //     socket.on(`userLeave${roomsDelete._id}`, () => {
    //         console.log("Người dùng đã rời phòng");
    //         setUserInRooms(false); // Đặt userInRooms thành false khi có người rời phòng
    //          // Đánh dấu tin nhắn là đã nhận khi có người rời phòng
    //     });
       

    //     return () => {
    //         socket.emit("onRoomLeave", { roomsId: roomsDelete._id })
    //         socket.off(`userJoin${roomsDelete._id}`)
    //         socket.off(`userLeave${roomsDelete._id}`)
    //     }
    // }, [roomsDelete._id, socket])
    useEffect(() => {
        buttonFriend();
       
        socket.on(`sendfriends${user.email}`, data => {
            if (data.reload) {
                
                        setUndo(friends.undo)
                    }
   
            else {
               
                    setUndo(friends.accept)   
     
                        
                }
            })
      
        return () => {
    
            socket.off(`sendfriends${user.email}`)
        }
    },[])
    useEffect(() => {
        socket.emit("onOnline", { user: user });
        
        socket.on(`updateSendedFriend${roomsDelete._id}${user.email}`, roomsU => {
            if (roomsU) {
                setUndo(friends.unfriend)
            }
            
        })
        socket.on(`acceptUserFriendsItem${user.email}`, data => {
            if (data) {
                setUndo(friends.unfriend)
            }
            
        })
            
        return () => {
           
            socket.off(`updateSendedFriend${roomsDelete._id}${user.email}`)
            socket.off(`acceptUserFriendsItem${user.email}`)
            
        }
    },[])
    const handleDelete = () => {
        const idP = {
            idRooms: roomsDelete._id,
        }
        const userAction = {
            id: user._id
        }

        deleteRooms(userAction.id, idP.idRooms)
        .then((res) => {
            if (user.email === roomsDelete.creator.email) {
                const userReciever1 = {id: roomsDelete.recipient._id}
                const rooms1 = { id: idP.idRooms }
                unFriends(userReciever1.id,rooms1)
                .then((resUser) => {
                    if (resUser.data.emailUserActions) {
                        // alert("Hủy kết bạn thành công")
                        setErrorMessage('Huỷ kết bạn thành công');
                                setShowErrorModal(true);
                                

                                setTimeout(() => {
                                    setShowErrorModal(false);
                                }, 2000);
                      
                    }
                    else {
                        // alert("Hủy kết bạn không thành công")
                        setLoi(false);

                                setErrorMessage('Huỷ kết bạn không thành công');
                                setShowErrorModal(true);
                                setTimeout(() => {
                                    setShowErrorModal(false);
                                }, 2000);
                    }
                })
                .catch((error) => {
                    // alert("Lỗi Server")
                    setLoi(false);

                    setErrorMessage('Lỗi server');
                    setShowErrorModal(true);
                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
                })
            } else {
                const userReciever2 = {id: roomsDelete.creator._id}
                const rooms2 = { id: idP.idRooms }
                console.log("Rơi xuống trường hợp 2");
                unFriends(userReciever2.id,rooms2)
                .then((resUser) => {
                    if (resUser.data.emailUserActions) {
                        // alert("Hủy kết bạn thành công")
                        setErrorMessage('Huỷ kết bạn thành công');
                        setShowErrorModal(true);
                        setTimeout(() => {
                            setShowErrorModal(false);
                        }, 2000);
                       
                    }
                    else {
                        // alert("Hủy kết bạn không thành công")
                        setLoi(false);

                        setErrorMessage('Huỷ kết bạn không thành công');
                        setShowErrorModal(true);
                        setTimeout(() => {
                            setShowErrorModal(false);
                        }, 2000);
                    }
                })
                .catch((error) => {
                    // alert("Lỗi Server")
                    setLoi(false);
                    setErrorMessage('Lỗi server');
                    setShowErrorModal(true);


                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
                })
            }
        })
        .catch((err) => {
            // alert("Lỗi hủy phòng")
            setLoi(false);
            setErrorMessage('Lỗi huỷ phòng');
            setShowErrorModal(true);

            setTimeout(() => {
                setShowErrorModal(false);
            }, 2000);
        })

    }
    const handleUndo = () => {
        const dataId = {
            id: idd,
            idRooms: roomsDelete._id,
        }
        const roomId = {
          idRooms: roomsDelete._id,
        }
        const userAction = {
            id: user._id
        }
        deleteRooms(userAction.id, roomId.idRooms)
        .then((res) => {
            undoFriends(dataId)
            .then((resData) => {
                if (resData.data.emailUserActions) {
                    // alert("Undo thành công")
                    setErrorMessage('Undo thành công');
                    setShowErrorModal(true);

                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
                   
                }
                else {
                    // alert("Undo không thành công")
                    setLoi(false);
                    setErrorMessage('Undo không thành công');
                    setShowErrorModal(true);

                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 2000);
                }

            })
            .catch((error) => {
                console.log(error);
            })
        })
        .catch((err) => {
            console.log(err);
            // alert("Lỗi Server khi delete Rooms")
            setLoi(false);
                setErrorMessage('Lỗi Server khi delete Rooms');
                setShowErrorModal(true);

                setTimeout(() => {
                    setShowErrorModal(false);
                }, 2000);
        })
    }
    const handleAccept = () => {
        const dataId = {
            id: idd,
        }
        const roomId = {
          idRooms: roomsDelete._id,
        }
        acceptFriends(dataId.id, roomId)
        .then((res) => {
            if (!res.data) {
                // alert('Đồng ý kết bạn không thành công')
                setLoi(false);
                setErrorMessage('Đồng ý kết bạn không thành công');
                setShowErrorModal(true);

                setTimeout(() => {
                    setShowErrorModal(false);
                }, 2000);
                return;            
            }
            
            // alert("Bây giờ các bạn là bạn bè")
            setUndo(friends.unfriend)
        })
        .catch((err) => {
            // alert("Lỗi hệ thống")
            setLoi(false);
                setErrorMessage('Lỗi hệ thống');
                setShowErrorModal(true);

                setTimeout(() => {
                    setShowErrorModal(false);
                }, 2000);
        })
    }
    const TestingFriend = () => {
        if (undo === friends.undo) {
            return (<div style={{
                backgroundColor: 'red',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '8px 20px',
                marginBottom: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }} onClick={handleUndo}> Undo</div>)
        }
        if (undo === friends.accept) {
            return (<div style={{
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '8px 20px',
                marginBottom: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }} onClick={handleAccept}> Accept</div>)
        }
        if (undo === friends.unfriend) {
            return (<div style={{
                backgroundColor: 'red',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '8px 20px',
                marginBottom: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }} onClick={handleDelete}> Unfriend</div>)
        }
        

    }
    return (
        <button className='item' onClick={() => { onClick() }} style={{ position: 'relative' }} onMouseEnter={() => mouseEntry(true)} onMouseLeave={() => handleLeave(false)}>
         {/* //<button className='item' onClick={() => { onClick(); handleFontWeightToggle() }} style={{ position: 'relative' }} onMouseEnter={() => mouseEntry(true)} onMouseLeave={() => handleLeave(false)}> */}

            <div className='item-name'>
                <img src={link} alt="" style={{ width: '50px', borderRadius: "50px" }} />
                <div className='name'>
                    <span className='mess-name'>{name}</span>
                   {/*  <span className='mess-infor'>{tt}{action}</span> */}
                    <span className='mess-infor' style={{ fontWeight: isFontWeightOn ? 'bold' : 'normal' }}>{tt}{action}</span>

                </div>
            </div>
            <span>{mouse ? (<div onClick={handleBtn}>...</div>) : (time)}
            </span>
            {btnForm && (
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', right: '0', justifyContent: 'center', zIndex: '50', marginTop: '22px' }}>
               <TestingFriend/>
            </div>)}
        </button>

    )
}

export default Item