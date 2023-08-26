const { Server }=require("socket.io");
const io=new Server(8000,{
    cors:true,
});

// create map to check ki kon si id kon se room mein hh
const emailtoSocketIdMap=new Map();
const socketIdtoemailMap=new Map();


io.on("connection",(socket)=>{
    console.log(`Socket connected`, socket.id);
    socket.on("room:join",(data)=>{
        // ye front wala data h jo lobby se bhej rhe hh
        console.log(data);
        const { email,room}=data;
        emailtoSocketIdMap.set(email,socket.id);
        socketIdtoemailMap.set(socket.id,email);
        
        // ye us room mein jo phle se hh usko
        //  btaane ke liye
        io.to(room).emit("user:joined",{email, id:socket.id});
        socket.join(room);

        // ye front-end ko confirmation bhej rhe h
        io.to(socket.id).emit("room:join",data);
    });

    socket.on("user:call",({to,offer})=>{
        io.to(to).emit("incoming:call",{from:socket.id,offer});
    });
    socket.on('call:accepted',({to,ans})=>{
        io.to(to).emit("call:accepted",{from:socket.id,ans});
    });
    socket.on('peer:nego:needed',({offer,to})=>{
        io.to(to).emit("peer:nego:needed",{offer,from:socket.id});
    });
    socket.on('peer:nego:done',({to,ans})=>{
        io.to(to).emit("peer:nego:final",{from:socket.id,ans});
    });
});