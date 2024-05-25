import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { AuthContext } from '../../untills/context/AuthContext'
import { SocketContext } from '../../untills/context/SocketContext';
import { createMessage } from '../../untills/api';
export const VoiceCall = () => { 
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const { id, fullName } = useParams();
    useEffect(() => {
        socket.emit("onOnline", { user: user });
        socket.on(`outCallVoice${user.email}`, data => {
            const appId = 1998362062
            const server = "9ada769fe864ea042332ce4abf759c6e"
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, server, id, Date.now().toString(), fullName )
                const zc = ZegoUIKitPrebuilt.create(kitToken)
                zc.hangUp()
                const data1 = {
                    content: "Cuộc gọi vữa kết thúc",
                    roomsID: id,
                };
                createMessage(data1)
                .then((res) => {
                    console.log(res);
                
                })
                .catch((err) => {
                    console.log(err);
                }); 
                setTimeout(() => {
                    socket.emit('outMeetVoice', { idRooms: id, user: user });
                }, 3000);
                setTimeout(() => {
                    
                    
                    
                    window.close();
               
                }, 3000);
           
        })
       
        return () => {
            socket.off(`outCallVoice${user.email}`)
            
        }
    }, [fullName, id, socket, user])
    const myMeeting = async (element) => {
        const appId = 1998362062
        const server = "9ada769fe864ea042332ce4abf759c6e"
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, server, id, Date.now().toString(), fullName )
        const zc = ZegoUIKitPrebuilt.create(kitToken)
        zc.joinRoom(  
            {
                turnOnMicrophoneWhenJoining: true,
                turnOnCameraWhenJoining: false,
                showMyCameraToggleButton: false,
                showMyMicrophoneToggleButton: true,
                showAudioVideoSettingsButton: true,
                showScreenSharingButton: true,
                showTextChat: false,
                showUserList: false,
                showPreJoinView: false,
                showRoomTimer: true,
                showLeavingView: false,
                maxUsers: 2,
                layout: "Auto",
                showLayoutButton: false,
                scenario: {
                    mode: "OneONoneCall",
              },
              container: element,
              onLeaveRoom: () => {
                socket.emit('leave-callVoice', { idRooms: id, userLeave: user });
            }
          }
        );
        
        

    }
    // console.log(myMetting);

    return (
        <div >
            
            <div style={{ width: '100%', height: '100vh'}} className="call-not-video"  ref={myMeeting} ></div>
        </div>
    )
}