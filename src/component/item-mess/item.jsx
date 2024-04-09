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
const Item = ({ link, name, action, time, tt, delele, roomsDelete , onClick,idd}) => {
    const [mouse, setMouse] = useState(false)
    const [btnForm, setBtnForm] = useState(false)
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [undo, setUndo] = useState(friends.undo);
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
    useEffect(() => {
        socket.on('connected', () => console.log('Connected'));
        socket.on("userOnline", (data) => {
            
            // if (data.userId === user.id) {
                console.log(`user ${data.email} Đang online`);
            // }
        });
        socket.on("userOffline", (data) => {
            // if (data.userId === user.id) {
                console.log(`user ${data.email} đã offline`);
            // }
        });
        return () => {
            socket.off('connected');
            socket.off("userOnline");
            socket.off("userOffline")
        }
    })
    useEffect(() => {
        buttonFriend();
        socket.on('connected', () => console.log('Connected'));
        socket.on(`sendfriends${user.email}`, data => {
            if (data.reload) {
                
                        setUndo(friends.undo)
                    }
   
            else {
               
                    setUndo(friends.accept)   
     
                        
                }
            })
      
        return () => {
            socket.off('connected');
            socket.off(`sendfriends${user.email}`)
        }
    },[])
    useEffect(() => {
        socket.on('connected', () => console.log('Connected'));
        socket.on(`updateSendedFriend${roomsDelete._id}${user.email}`, roomsU => {
            if (roomsU) {
                setUndo(friends.unfriend)
            }
            
        })
        return () => {
            socket.on('connected', () => console.log('Connected'));
            socket.off(`updateSendedFriend${roomsDelete._id}${user.email}`)
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
                        alert("Hủy kết bạn thành công")
                      
                    }
                    else {
                        alert("Hủy kết bạn không thành công")
                    }
                })
                .catch((error) => {
                    alert("Lỗi Server")
                })
            } else {
                const userReciever2 = {id: roomsDelete.creator._id}
                const rooms2 = { id: idP.idRooms }
                console.log("Rơi xuống trường hợp 2");
                unFriends(userReciever2.id,rooms2)
                .then((resUser) => {
                    if (resUser.data.emailUserActions) {
                        alert("Hủy kết bạn thành công")
                       
                    }
                    else {
                        alert("Hủy kết bạn không thành công")
                    }
                })
                .catch((error) => {
                    alert("Lỗi Server")
                })
            }
        })
        .catch((err) => {
            alert("Lỗi hủy phòng")
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
                    alert("Undo thành công")
                   
                }
                else {
                    alert("Undo không thành công")
                }

            })
            .catch((error) => {
                console.log(error);
            })
        })
        .catch((err) => {
            console.log(err);
            alert("Lỗi Server khi delete Rooms")
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
                alert('Đồng ý kết bạn không thành công')
                return;            
            }
            
            alert("Bây giờ các bạn là bạn bè")
            setUndo(friends.unfriend)
        })
        .catch((err) => {
            alert("Lỗi hệ thống")
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
        <button className='item' onClick={onClick} style={{ position: 'relative' }} onMouseEnter={() => mouseEntry(true)} onMouseLeave={() => handleLeave(false)}>
            <div className='item-name'>
                <img src={link} alt="" style={{ width: '50px', borderRadius: "50px" }} />
                <div className='name'>
                    <span className='mess-name'>{name}</span>
                    <span className='mess-infor'>{tt}{action}</span>
                </div>
            </div>
            <span>{mouse ? (<div onClick={handleBtn}>...</div>) : (time)}
            </span>
            {btnForm && (
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', right: '0', justifyContent: 'center', zIndex: '50', marginTop: '22px' }}>
               <TestingFriend/>
                {/* {undo === true ?(
                <div style={{
                    backgroundColor: 'red',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '8px 20px',
                    marginBottom: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }} onClick={handleUndo}> Undo</div>
             ): (
                <div style={{
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 20px',
                        marginBottom: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }} onClick={handleAccept}> Accept</div>
                )} */}
                </div>)}
        </button>

    )
}

export default Item