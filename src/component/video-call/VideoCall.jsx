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
        socket.on(`outCallVoice${user.email}`, data => {
            const appId = 1252444371
            const server = "2fc5c334289bb36e20d55622f5578d16"
         
           
            
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, server, id, Date.now().toString(), fullName )
                const zc = ZegoUIKitPrebuilt.create(kitToken)
                zc.hangUp()
                const data1 = {
                    content: "Cuộc gọi vữa kết thúc",
                    roomsID: id,
                };
                createMessage(data1)
                setTimeout(() => {
                    socket.emit('outMeetVoice', { idRooms: id, user: user });
                    
                        window.close();
               
                }, 4000);
           
        })
       
        return () => {
            socket.off(`outCallVoice${user.email}`)
            
        }
    }, [fullName, id, socket, user])
    const myMeeting = async (element) => {
        const appId = 1252444371
        const server = "2fc5c334289bb36e20d55622f5578d16"
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, server, id, Date.now().toString(), fullName )
        const zc = ZegoUIKitPrebuilt.create(kitToken)
        const leaveRooms = () => {
            zc.hangUp()
        }
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
