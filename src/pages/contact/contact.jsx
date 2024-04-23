import React, { useContext, useEffect, useRef, useState } from 'react';
import './contact.scss';
// import Item from '../../component/item-mess/item';
// import ItemFriend from '../../component/item-friend/item-friend'
import ItemInfoFriend from '../../component/item-info-friend/item-info-friend'
import { Link } from 'react-router-dom';
import ItemInfoGroup from '../../component/item-info-group/item-info-group';
import ItemInfoFriendRequest from '../../component/item-info-friend-request/item-info-friend-request';
import { AuthContext } from '../../untills/context/AuthContext';
import { SocketContext } from '../../untills/context/SocketContext';
import { getListGroups, getListRooms } from '../../untills/api';
const contact = {
    listFriends: 'listfriend',
    listGroup: 'listgroup',
    friendRequest: 'friendrequest'

}
export const UiContact = () => {


    const formRefTT = useRef(null);

    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [friends, setFriends] = useState([])
    const [waitAccept, setWaitAccept] = useState([])
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        setWaitAccept(user.waitAccept)
        getListGroups()
        .then(res => {
            // Chỉ setRooms với các object đã được lọc
            setGroups(res.data);
               
        })
        .catch(err => {
            console.log(err);
            console.log("Đã rơi zô đây");
        })
        getListRooms()
        .then(res => {
            // Chỉ setRooms với các object đã được lọc
            const roomsWithFriends = res.data.filter(room => room.friend === true);
        // Cập nhật state với các phòng đã lọc
            setFriends(roomsWithFriends);
       
        })
        .catch(err => {
            console.log(err);
            console.log("Đã rơi zô đây");
        })
    },[])
    useEffect(() => {
        socket.on('connected', () => console.log('Connected'));
        // socket.on(`updateAcceptFriendsGroups${user.email}`, data => {
        //     if (data) {
        //         setFriends(prevGroups => [...prevGroups, data])
               
        //     }
        // })
        
        socket.on(`createGroups${user.email}`, data => {
            setGroups(prevGroups => [...prevGroups, data])
        })
        socket.on(`updateSendedFriend${user.email}`, roomsU => {
            if (roomsU) {
                return setFriends(prevRooms => [roomsU, ...prevRooms]);  
            }
            
        })
        socket.on(`unfriends${user.email}`, data => {
            if (data) {
                setFriends(prevRooms => {
                    // Cập nhật phòng đã được cập nhật
                    return prevRooms.filter(item => item._id !== data.roomsUpdate)
                });  
                
            }
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
        return () => {
            socket.off('connected');
            //socket.off(`updateAcceptFriendsGroups${user.email}`)
            socket.off(`createGroups${user.email}`)
            socket.off(`deleteGroups${user.email}`)
            socket.off(`leaveGroups${user.email}`)
            socket.off(`attendMessagesGroup${user.email}`)
            socket.off(`attendMessagesGroupsss${user.email}`)
            socket.off(`updateSendedFriend${user.email}`)
            socket.off(`unfriends${user.email}`)
        }
    },[])
    const [page, setPage] = useState(contact.listFriends)
    const [participant, setParticipant] = useState([])
    const settingUsers = (data) => {
        if (data.creator.email === user.email) {
            return data.recipient;
        } else {
            return data.creator;
        }
    }
    const PagesContact = () => {
        if (page === contact.listFriends) {
            return (
                <div className='section-three-sco'>
                    <div className='title'>
                        <div className='title-inner'>
                            <i className="bx bx-user"></i>
                            <p className='title-content'>List Friend</p>
                        </div>
                    </div>
                    <div className='friend-number'>
                        <h3>Friends ({friends.length})</h3>
                    </div>
                    <div className='bar-search'>
                        <div className='bar-search-wrapper'>
                            <i className='bx bx-search-alt-2'></i>
                            <input className='input-search' type="search" placeholder=' Search' />
                        </div>
                    </div>
                    <div className="list-friend-wrapper">


                        {/* <div className='friend-name'>
                            <div className='letter'> A </div>
                            <div className='info'>
                                <ItemInfoFriend avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Anh Tuan' />
                            </div>
                            <div className='letter'> B </div>
                            <div className='info'>
                                <ItemInfoFriend avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Bao Thai Quang' />
                            </div>
                        </div> */}
                        <div className='friend-name'>
                            {friends.map(friend => (
                                <ItemInfoFriend key={friend._id} avatar={settingUsers(friend).avatar} name={settingUsers(friend).fullName} />
                            ))}




                        </div>


                    </div>
                </div>
            )

        }
        else if (page === contact.listGroup) {
            return (<div className='section-three-sco'>
                <div className='title'>
                    <div className='title-inner'>
                        <i className="bx bx-group"></i>
                        <p className='title-content'>List Groups</p>
                    </div>
                </div>

                <div className='group-number'>
                    <h3>Groups ({groups.length})</h3>
                </div>

                <div className='bar-search'>
                    <div className='bar-search-wrapper'>
                        <i className='bx bx-search-alt-2'></i>
                        <input className='input-search' type="search" placeholder=' Search' />
                    </div>
                </div>

                <div className='group-name'>
                    {groups.map(group =>(
                        <ItemInfoGroup key={group._id} avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name={group.nameGroups} members={`${group.participants.length + 1} members`} />
                    ))}
                    
                 

                </div>
            </div>)
        }
        else if (page === contact.friendRequest) {
            return (<div className='section-three-sco'>
                <div className='title'>
                    <div className='title-inner'>
                        <i className="bx bx-envelope"></i>
                        <p className='title-content'>Friend Request</p>
                    </div>
                </div>

                <div className='friend-request-number'>
                    <h3>Friend Requests ({waitAccept.length})</h3>
                </div>


                <div className="list-group-wrapper">
                    {
                        waitAccept.map(friendAccept => (
                            // <ItemInfoFriendRequest key={friendAccept._id} avatar={friendAccept.avatar} name={friendAccept.fullName} date={friendAccept.phoneNumber  } button1='Accept' />
                            <ItemInfoFriendRequest key={friendAccept._id} friendRequest={friendAccept} />
                        ))
                    }

                </div>




            </div>)
        }
    }
    return (
        <div className='container'>

            <div className='wrapper'>
                <div className='section-one'>
                    <div className='list-icon'>
                        <Link to={'/page'}> <i className='bx bx-home'></i></Link>
                        <Link to={'/contact'} > <i className='bx bxs-contact' ></i></Link>
                        <Link><i className='bx bx-cog' ></i></Link>
                        <Link to={'/cloud'}> <i className='bx bx-cloud' ></i></Link>
                        <Link> <i className='bx bx-briefcase'></i></Link>
                    </div>

                    <div className='avt'>
                        <button className='btn-avt'><img src="https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain" alt="" style={{ width: '80%', borderRadius: "50px" }} /></button>
                        <span>tun anh</span>
                    </div>
                </div>
                <div className='section-two'>




                    {/* doi het cai form nay */}

                    <div className='list-friend'>
                        <i id='icon-contact' className='bx bx-user' onClick={() => setPage(contact.listFriends)} style={page === contact.listFriends ? { color: 'rgb(240, 143, 23)' } : { color: 'black' }}> List Friend</i>
                        <i id='icon-contact' className='bx bx-group' onClick={() => setPage(contact.listGroup)} style={page === contact.listGroup ? { color: 'rgb(240, 143, 23)' } : { color: 'black' }}> List Group</i>
                        <i id='icon-contact' className='bx bx-envelope' onClick={() => setPage(contact.friendRequest)} style={page === contact.friendRequest ? { color: 'rgb(240, 143, 23)' } : { color: 'black' }} > Friend Request</i>
                    </div>
                </div>
                <PagesContact />

            </div>
        </div>
    );
}

