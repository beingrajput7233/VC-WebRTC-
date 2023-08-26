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
        

        // ye front-end ko confirmation bhej rhe h
        io.to(socket.id).emit("room:join",data);
    });
});