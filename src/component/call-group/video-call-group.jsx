import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { AuthContext } from '../../untills/context/AuthContext'
import { SocketContext } from '../../untills/context/SocketContext';
import { createMessagesGroup } from '../../untills/api';
export const VideoCallGroup = () => { 
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const { id, fullName, members } = useParams();
    useEffect(() => {
        socket.emit("onOnline", { user: user });
        socket.on(`outCallGroup${user.email}`, data => {
            socket.emit('memberOutMeetGroup', { idGroup: id, user: data.userLeave });
            setTimeout(() => {
                window.close();              
            }, 4000);
        })
       socket.on(`outCallGroupLastUser${user.email}`, data  => {
        socket.emit('memberOutMeetGroup', { idGroup: id, user: data.userLeave });
        const appId = 1657103294
        const server = "6702c8d71db0bfea3e583c39e2155d25"
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, server, id, Date.now().toString(), fullName )
            const zc = ZegoUIKitPrebuilt.create(kitToken)
            const data1 = {
                content: "Cuộc gọi nhóm đã kết thúc 📴",
                groupsID: id,
            };
            createMessagesGroup(data1)
            zc.hangUp()
            setTimeout(() => {
                window.close();              
            }, 4000);
           
       })
        return () => {
            socket.off(`outCallGroup${user.email}`)
            socket.off(`outCallGroupLastUser${user.email}`)
        }
    }, [fullName, id, socket, user])
    const myMeeting = async (element) => {
        const appId = 1657103294
        const server = "6702c8d71db0bfea3e583c39e2155d25"
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, server, id, Date.now().toString(), fullName )
        const zc = ZegoUIKitPrebuilt.create(kitToken)
        const quantity = Number(members);
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
                maxUsers: quantity,
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
                socket.emit('leave-callGroup', { idGroup: id, userLeave: user });
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