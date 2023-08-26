import React from "react";
import { useEffect,useCallback,useState } from "react";
import ReactPlayer from 'react-player';
import { useSocket } from "../context/Socketprovider";
import peer from "../service/peer";

const RoomPage=()=>{
    const socket=useSocket();
    // ye remote socket Id dusre user ki id hai
    const [remoteSocketId,setRemoteSocketId]=useState(null);
    const [myStream,setMyStream]=useState(null);

    const handleUserJoined=useCallback(({email,id})=>{
        console.log(`Email ${email} joined Room`);
        setRemoteSocketId(id);
    },[]);


    const handleIncomingCall=useCallback(async ({from,offer})=>{
        // console.log(`HI`);
        setRemoteSocketId(from);
        const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:true});
        setMyStream(stream);
        console.log(`Incoming call`,from,offer);
        const ans=await peer.getAnswer(offer);
        // ab is answerko phle wale user ko send krna h
            socket.emit("call:accepted",{to:from,ans});

    },[socket]);

    

    const handleCallUser=useCallback(async()=>{
        // Apni video on
        const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:true});
        const offer=await peer.getOffer();
        socket.emit("user:call",{to: remoteSocketId,offer});
        setMyStream(stream);
    },[remoteSocketId,socket]);

    const handleCallAccepted=useCallback(({from,ans})=>{
        peer.setLocalDescription(ans);
        console.log('Call Accepted')
    },[]);
    // ye backend se aaya
    useEffect(()=>{
        socket.on('user:joined',handleUserJoined);
        socket.on('incoming:call',handleIncomingCall);
        socket.on('call:accepted',handleCallAccepted);
        return ()=>{
            socket.off('user:joined',handleUserJoined);
            socket.off('incoming:call',handleIncomingCall);
            socket.off('call:accepted',handleCallAccepted);
        }
    },[socket,handleUserJoined,handleIncomingCall,handleCallAccepted]);
    return (
        <div>
            <h1>Room Page</h1>
            <h4>{remoteSocketId?'Connected':'No one in room'}</h4>
            {/* if room mein dusra bnda hai tbhi krenge apni stream */}
            {remoteSocketId&&<button onClick={handleCallUser}>CALL</button>}
            {
                //Agar myStream hai toh usko render krenge
                myStream&&(
                <>
                <h1>My Stream</h1>
                <ReactPlayer playing muted height="100px" width="200px" url={myStream} />
                </>
                )
            }
        </div>
    )
}
export default RoomPage;