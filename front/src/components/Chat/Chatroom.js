import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from "axios";
import { Link } from "react-router-dom";

const ChatRoom = (props) => {
    const [chatrooms, setChatrooms] = React.useState([]);
    const chatRoomRef = React.createRef();
    const getChatrooms = () => {
        axios
          .get("http://localhost:8000/chatroom", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("CC_Token"),
            },
          })
          .then((response) => {
            setChatrooms(response.data);
          })
          .catch((err) => {
            setTimeout(getChatrooms, 3000);
          });
    };

    const createChatrooms = () => {
        let postData = {
            name: chatRoomRef.current.value
        }
        axios
            .post("http://localhost:8000/chatroom",
                postData,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("CC_Token"),
                    },
                })
            .then((response) => {
                // console.log("response.data--", response.data)
                // setChatrooms(response.data);
            })
            .catch((err) => {
                setTimeout(getChatrooms, 3000);
            });
    };

    React.useEffect(() => {
        getChatrooms();
        // eslint-disable-next-line
    }, []);


    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Chatroom Name</h1>
                <div>
                    <input
                        type="text"
                        name="chatroomName"
                        id="chatroomName"
                        placeholder="Chat room Name"
                        ref={chatRoomRef}
                        className="joinInput"
                    />
                </div>

                <button className={'button mt-20'} onClick={createChatrooms} >Create Chatroom</button>

                <div className="chatrooms">
                    {chatrooms.map((chatroom) => (
                        <div key={chatroom._id} className="chatroom">
                            <div className='room'>{chatroom.name}</div>
                            <Link to={"/chatroom/" + chatroom._id}>
                                <div className="join">Join</div>
                            </Link>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    )
}

export default ChatRoom;