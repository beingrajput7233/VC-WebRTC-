import React from "react";
import { useNavigate } from "react-router-dom";
import { useState ,useCallback,useEffect} from "react";
import { useSocket } from "../context/Socketprovider";
// lobby mein user id and room number lenge
const LobbyScreen=()=>{
    const [email,setEmail]=useState("");
    const [room,setRoom]=useState("");
    {/*  form submission */}

    const socket=useSocket();
    const navigate=useNavigate();
    console.log(socket);

    const handleSubmitForm=useCallback((e)=>{
        e.preventDefault();
        // ye frontend se request gai join krne ki
        socket.emit("room:join",{email,room});
        console.log({
            email,
            room,
        });
    },[email,room,socket]);

    const handleJoinRoom=useCallback((data)=>{
        const {email,room}=data;
        // to navigate to desired room number
        navigate(`/room/${room}`);
    },[]);

    // Ab backend se confirmation aane par
    useEffect(()=>{
        socket.on("room:join",handleJoinRoom);
        return ()=>{
            socket.off('room:join',handleJoinRoom);
        }
    },[socket]);

    // ab room join krna hh



    return (
        <div>
            <h1>Lobby</h1>
            <form onSubmit={handleSubmitForm}>
                <label htmlFor="email">Email Id</label>
                <input type="email" id="email" value={email} onChange={e=>setEmail(e.target.value)} />
                <br/>
                <label htmlFor="room">Room Number</label>
                <input type="text" id="room" value={room} onChange={e=>setRoom(e.target.value)}/>
                <br />
                <button type="submit">Join</button>
            </form>
        </div>
    )
}

export default LobbyScreen;