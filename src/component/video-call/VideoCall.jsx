import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { AuthContext } from '../../untills/context/AuthContext'
import { SocketContext } from '../../untills/context/SocketContext';
import { createMessage } from '../../untills/api';
export const VideoCall = () => {
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const { id, fullName } = useParams();
    useEffect(() => {
        socket.emit("onOnline", { user: user });
        socket.on(`outCallVideo${user.email}`, data => {
            const appId = 209552833
            const server = "eb7fd39e0acacc7a5a6c8a00da69cde6"
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, server, id, Date.now().toString(), fullName )
                const zc = ZegoUIKitPrebuilt.create(kitToken)
                zc.hangUp()
                const data1 = {
                    content: "Cuộc gọi vữa kết thúc",
                    roomsID: id,
                };
                createMessage(data1)
                setTimeout(() => {
                    socket.emit('outMeetVideo', { idRooms: id, user: user });
                    
                        window.close();
               
                }, 4000);
           
        })
       
        return () => {
            socket.off(`outCallVideo${user.email}`)
            
        }
    }, [fullName, id, socket, user])
    const myMeeting = async (element) => {
        const appId = 209552833
        const server = "eb7fd39e0acacc7a5a6c8a00da69cde6"
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, server, id, Date.now().toString(), fullName )
        const zc = ZegoUIKitPrebuilt.create(kitToken)
        zc.joinRoom(  
            {
                turnOnMicrophoneWhenJoining: true,
                turnOnCameraWhenJoining: true,
                showMyCameraToggleButton: true,
                showMyMicrophoneToggleButton: true,
                showAudioVideoSettingsButton: true,
                showScreenSharingButton: true,
                showTextChat: false,
                showUserList: false,
                maxUsers: 2,
                layout: "Auto",
                showLayoutButton: false,
                showPreJoinView: false,
                showRoomTimer: true,
                showLeavingView: false,
                scenario: {
                    mode: "OneONoneCall",
                },   
              
                container: element,
                onLeaveRoom: () => {
                    socket.emit('leave-callVideo', { idRooms: id, userLeave: user });
                }
            }
        );
        
        

    }
    // console.log(myMetting);

    return (
        <div >
            
            <div style={{ width: '100%', height: '100vh'}} className="call-video"  ref={myMeeting} ></div>
        </div>
    )
}
