import React from "react";
import { useEffect,useCallback,useState } from "react";
import ReactPlayer from 'react-player';
import { useSocket } from "../context/Socketprovider";
const RoomPage=()=>{
    const socket=useSocket();
    // ye remote socket Id dusre user ki id hai
    const [remoteSocketId,setRemoteSocketId]=useState(null);
    const [myStream,setMyStream]=useState(null);

    const handleUserJoined=useCallback(({email,id})=>{
        console.log(`Email ${email} joined Room`);
        setRemoteSocketId(id);
    },[]);

    // ye backend se aaya
    useEffect(()=>{
        socket.on('user:joined',handleUserJoined);
        return ()=>{
            socket.off('user:joined',handleUserJoined);
        }
    },[socket,handleUserJoined]);

    const handleCallUser=useCallback(async()=>{
        // Apni video on
        const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:true});
        setMyStream(stream);
    },[]);

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