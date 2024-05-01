import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { AuthContext } from '../../untills/context/AuthContext'
import { SocketContext } from '../../untills/context/SocketContext';
import { createMessage } from '../../untills/api';
export const VideoCallGroup = () => { 
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const { id, fullName, members } = useParams();
    const myMeeting = async (element) => {
        const appId = 563120761
        const server = "a1e95398516cc29580cebd002d262d61"
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
                showUserList: true,
                maxUsers: members,
                layout: "Grid",
                showLayoutButton: true,
                showPreJoinView: false,
                showRoomTimer: true,
                showLeavingView: false,
                scenario: {
                    mode: "GroupCall",
                },
              
              container: element,
              onLeaveRoom: () => {
                socket.emit('leave-callGroup', { idRooms: id, userLeave: user });
            }
          }
        );
        
       

    }
    return (
        <div >
            
            <div style={{ width: '100%', height: '100vh'}} className="call-group-video"  ref={myMeeting} ></div>
        </div>
    )
}