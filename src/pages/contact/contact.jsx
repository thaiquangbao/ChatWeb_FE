import React, { useContext, useEffect, useRef, useState } from 'react';
import './contact.scss';
// import Item from '../../component/item-mess/item';
// import ItemFriend from '../../component/item-friend/item-friend'
import ItemInfoFriend from '../../component/item-info-friend/item-info-friend'
import { Link } from 'react-router-dom';
import ItemInfoGroup from '../../component/item-info-group/item-info-group';
import ItemInfoFriendRequest from '../../component/item-info-friend-request/item-info-friend-request';
import { AuthContext } from '../../untills/context/AuthContext';

const contact = {
    listFriends: 'listfriend',
    listGroup: 'listgroup',
    friendRequest: 'friendrequest'

}
export const UiContact = () => {


    const formRefTT = useRef(null);

    const { user } = useContext(AuthContext);

    //



    useEffect(() => {
        console.log(user);
    })
    const [page, setPage] = useState(contact.listFriends)
    const [participant, setParticipant] = useState([])

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
                        <h3>Friends ({user.friends.length})</h3>
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
                            {user.friends.map(friend => (
                                <ItemInfoFriend key={friend._id} avatar={friend.avatar} name={friend.fullName} />
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
                    <h3>Groups (2)</h3>
                </div>

                <div className='bar-search'>
                    <div className='bar-search-wrapper'>
                        <i className='bx bx-search-alt-2'></i>
                        <input className='input-search' type="search" placeholder=' Search' />
                    </div>
                </div>

                <div className='group-name'>
                    <ItemInfoGroup avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Group CNM' members='3 members' />
                    <ItemInfoGroup avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Group On Tap' members='4 members' />
                    <ItemInfoGroup avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Group On Tap' members='4 members' />
                    <ItemInfoGroup avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Group On Tap' members='4 members' />
                    <ItemInfoGroup avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Group On Tap' members='4 members' />
                    <ItemInfoGroup avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Group On Tap' members='4 members' />
                    <ItemInfoGroup avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Group On Tap' members='4 members' />

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
                    <h3>Friend Requests ({user.waitAccept.length})</h3>
                </div>


                <div className="list-group-wrapper">
                    {
                        user.waitAccept.map(friendAccept => (
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
                        <Link to={'/uidsbb'} > <i className='bx bxs-contact' ></i></Link>
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

