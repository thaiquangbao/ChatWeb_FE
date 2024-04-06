// import React from 'react'
// import './item.scss'
// const Item = ({ link, name, action, time, tt, onClick }) => {
//     return (
//         <button className='item' onClick={onClick}>
//             <div className='item-name'>
//                 <img src={link} alt="" style={{ width: '50px', borderRadius: "50px" }} />
//                 <div className='name'>
//                     <span className='mess-name'>{name}</span>
//                     <span className='mess-infor'>{tt}{action}</span>
//                 </div>
//             </div>
//             <span>{time}</span>

//         </button>

//     )
// }

// export default Item
import React, { useState, useContext } from 'react'
import './item.scss'
import { AuthContext } from '../../untills/context/AuthContext'
import { deleteRooms, unFriends } from '../../untills/api'
const Item = ({ link, name, action, time, tt, delele, roomsDelete , onClick,idd}) => {
    const [mouse, setMouse] = useState(false)
    const [btnForm, setBtnForm] = useState(false)
    const { user } = useContext(AuthContext);
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

        console.log(idd)
    }
    const handleAccept = () => {

        console.log(idd)
    }
    const testingFriend = () => {
        if (user.sendFriend.some(item => item._id === idd)) {
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
        if (user.waitAccept.some(item => item._id === idd)) {
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
                   {testingFriend()}
                </div>)}
        </button>

    )
}

export default Item