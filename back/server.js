require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection.on("error", (err) => {
    console.log("Mongoose Connection ERROR: " + err.message);
});

mongoose.connection.once("open", () => {
    console.log("MongoDB Connected!");
});

//Bring in the models
require("./models/User");
require("./models/Chatroom");
require("./models/Message");

const app = require("./app");

const server = app.listen(8000, () => {
    console.log("Server listening on port 8000");
});

const io = require("socket.io")(server, {
    allowEIO3: true,
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const jwt = require("jwt-then");

const Message = mongoose.model("Message");
const User = mongoose.model("User");


/* io.use(async (socket, next) => {
    let usertoken = socket.handshake.query.token;
    if(usertoken){
        try {
            const payload = await jwt.verify(usertoken, process.env.SECRET);
            socket.userId = payload.id;
        } catch (err) {console.log("err: " + err); }
    }
    next();
}); */


io.on('connect', (socket) => {
    // let userId = socket.userId

    

    socket.on('joinRoom', ({ id, userid }) => {
        socket.join(id);
        console.log("A user joined chatroom: " + id);
        User.updateOne({_id:mongoose.Types.ObjectId(userid)}, 
            {$set: {online:true}}, function (err, docs) {
            if (err){
                // console.log(err)
            }
            else{
                // console.log("Updated Docs : ", docs);
            }
        });
    });

    socket.on("lastMsgs", ( uesrid, id , callback) => {
        Message.find({ user: mongoose.Types.ObjectId(uesrid), chatroom: mongoose.Types.ObjectId(id) })
        .sort({createdAt: -1})
        .limit(5)
        .exec(function(err,post){
            callback(post)
        })
    });

    
    socket.on("onlineUsers", ( id , callback) => {
        Message.aggregate([
            {
                $match: {
                    chatroom: mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: "users", // collection name in db
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $match: {
                    "user.online": true
                }
            },
            {
                $group: {
                    _id: "$user.name"
                }
            },
            {
                $unwind: {
                    path: "$_id"
                }
            },
            {
                $project: {
                    name: "$_id"
                }
            }

        ], function (err, data) {
            if (err)
                throw err;
            
            callback(data)
        })
    });

    socket.on("leaveRoom", ({ id, userid }) => {
        socket.leave(id);
        console.log("room leaved:" + id)

        User.updateOne({_id:mongoose.Types.ObjectId(userid)}, 
            {$set: {online:false}}, function (err, docs) {
            if (err){
                // console.log(err)
            }
            else{
                // console.log("Updated Docs : ", docs);
            }
        });
    });


    socket.on('sendMessage', async (userid, chatroomId, message, callback) => {

        if (message.trim().length > 0 && userid) {
            const user = await User.findOne({ _id: userid });
            const newMessage = new Message({
                chatroom: chatroomId,
                user: user._id,
                message,
            });
            await io.to(chatroomId).emit("newMessage", {
                text: message,
                user: user.name,
                userId: user._id,
            });
            await newMessage.save();

            Message.find({ chatroom: chatroomId })
                /* .sort({createdAt: -1}) */
                .exec(function (err, post) {
                    let arr = []
                    for (const msg of post) {
                        // console.log(`A JavaScript type is: ${msg}`)
                        arr.push({
                            text: msg.message,
                            user: user.name,
                            userId: user._id,
                        })
                    }
                    console.log(arr)
                    io.to(chatroomId).emit('newMessage', { message: arr });
                })

            

            callback();
        }
    });



    socket.on('disconnect', () => {
        /* const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        } */
    })
});


