import React, { useRef, useState } from 'react';
import './contact.scss';
// import Item from '../../component/item-mess/item';
// import ItemFriend from '../../component/item-friend/item-friend'
import ItemInfoFriend from '../../component/item-info-friend/item-info-friend'
import { Link } from 'react-router-dom';
import ItemInfoGroup from '../../component/item-info-group/item-info-group';
import ItemInfoFriendRequest from '../../component/item-info-friend-request/item-info-friend-request';
const contact = {
    listFriends: 'listfriend',
    listGroup: 'listgroup',
    friendRequest: 'friendrequest'

}
const UiContact = () => {

    const formRef = useRef(null);
    //1 dong moi
    const overla = useRef(null);
    const formRefTT = useRef(null);
    const formRefG = useRef(null);
    const handleButtonClickGroup = () => {
        if (formRefG.current.style.display === 'block') {
            //1 dong moi
            overla.current.style.display = 'none';
            formRefG.current.style.display = 'none';
        } else {
            //1 dong moi
            overla.current.style.display = 'block';
            formRefG.current.style.display = 'block';
        }
    };
    //doi doan nay
    const handleButtonClickTT = () => {
        if (formRefTT.current.style.display === 'block') {
            overla.current.style.display = 'none';
            formRefTT.current.style.display = 'none';
        } else {
            overla.current.style.display = 'block';
            formRefTT.current.style.display = 'block';
        }
    };
    //
    const handleButtonClick = () => {
        if (formRef.current.style.display === 'block') {
            //1 dong moi
            overla.current.style.display = 'none';
            formRef.current.style.display = 'none';
        } else {
            overla.current.style.display = 'block';
            formRef.current.style.display = 'block';

        }
    };
    const handleButtonDe = () => {
        formRef.current.style.display = 'none';
        //1 dong moi
        overla.current.style.display = 'none';
    };
    const handleButtonDeTT = () => {
        formRefTT.current.style.display = 'none';
        //1 dong moi
        overla.current.style.display = 'none';
    };
    const handleButtonDeG = () => {
        formRefG.current.style.display = 'none';
        overla.current.style.display = 'none';
    };

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
                        <h3>Friends (22)</h3>
                    </div>
                    <div className="list-friend-wrapper">
                        <div className='bar-search'>
                            <div className='bar-search-wrapper'>
                                <i className='bx bx-search-alt-2'></i>
                                <input className='input-search' type="search" placeholder=' Search' />
                            </div>

                        </div>

                        <div className='friend-name'>
                            <div className='letter'> A </div>
                            <div className='info'>
                                <ItemInfoFriend avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Anh Tuan' />
                            </div>
                            <div className='letter'> B </div>
                            <div className='info'>
                                <ItemInfoFriend avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Bao Thai Quang' />
                            </div>
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
                    <h3>Friend Requests (2)</h3>
                </div>


                <div className="list-group-wrapper">
                    <ItemInfoFriendRequest avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Thanh Nhat' date='3 days ago' button1='Accept' button2='Cancel Request' />
                    <ItemInfoFriendRequest avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Tuan Anh' date='1 min ago' button1='Accept' button2='Cancel Request' />
                    <ItemInfoFriendRequest avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Thanh Nhat' date='3 days ago' button1='Accept' button2='Cancel Request' />
                    <ItemInfoFriendRequest avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Tuan Anh' date='1 min ago' button1='Accept' button2='Cancel Request' />
                    <ItemInfoFriendRequest avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Tuan Anh' date='1 min ago' button1='Accept' button2='Cancel Request' />
                    <ItemInfoFriendRequest avatar='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' name='Tuan Anh' date='1 min ago' button1='Accept' button2='Cancel Request' />
                </div>




            </div>)
        }
    }
    return (
        <div className='container'>
            <div id="overlay" ref={overla}></div>
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
                        <button className='btn-avt' onClick={handleButtonClickTT}><img src="https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain" alt="" style={{ width: '80%', borderRadius: "50px" }} /></button>
                        <span>tun anh</span>
                    </div>
                </div>
                <div className='section-two'>
                    <div className='bar-search'>
                        <i className='bx bx-search-alt-2' ></i>
                        <input type="search" placeholder='search' />
                        <button onClick={handleButtonClick}><i className='bx bx-user-plus' ></i></button>
                        <button onClick={handleButtonClickGroup}><i className='bx bx-group'></i></button>

                    </div>
                    <div id='myForm' ref={formRef}>
                        <form >
                            <div className='titleadd'>
                                <h2>Add friend</h2>
                            </div>
                            <div>
                                <span className='ttadd'>+84<input type="tel" placeholder='Number phone' required></input></span>
                            </div>
                            <div className='endAdd'>
                                <button onClick={handleButtonDe} >Cancel</button>
                                <input type="submit" value="Search" className='timKiem' />
                            </div>

                        </form>
                    </div>

                    <div id='myFormG' ref={formRefG}>
                        <form >
                            <div className='titleaddG'>
                                <h2>Add group</h2>
                            </div>
                            <div>
                                <span className='ttaddG'><i className='bx bx-image' ></i><input type="text" placeholder='Name group' required></input></span>
                            </div>
                            <div className='ctaddG'>
                                <div className='ctaddG1'>


                                </div>
                                <div className='ctaddG2'>
                                    <div>
                                        Đã chọn 1/100
                                    </div>
                                    <div>

                                    </div>
                                </div>
                            </div>
                            <div className='endAddG'>
                                <button onClick={handleButtonDeG} >Cancel</button>
                                <input type="submit" value="Search" className='timKiem' />
                            </div>

                        </form>
                    </div>
                    {/* doi het cai form nay */}
                    <div id='myFormTT' ref={formRefTT}>
                        < h3>Personal Information <button className='btn-off' onClick={handleButtonDeTT}><i class='bx bx-x'></i></button></h3>

                        <form >
                            <img id='background' src='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' alt="" />
                            <div className='image-name'>
                                <img src='https://th.bing.com/th/id/OIP.dOTjvq_EwW-gR9sO5voajQHaHa?rs=1&pid=ImgDetMain' alt="" style={{ width: '80px', borderRadius: "50px", border: '1px solid black' }} />
                                <span id='name'>Tuấn Anh</span><br /><br />
                            </div>
                            <div className='infor'>
                                <label >Gender:</label>
                                <span id='gender'>Male</span> <br /><br />
                                <label>Date of Birth:</label>
                                <span id='birthday'>25/6/2002</span> <br /><br />
                                <label >Phone Number:</label>
                                <span id='phone'>0919199199</span> <br /><br />
                            </div>

                        </form>
                        <button className='btn-update-infor'>Update </button>
                    </div>

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

export default UiContact;
