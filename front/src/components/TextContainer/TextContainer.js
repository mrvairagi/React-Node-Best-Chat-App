import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import './TextContainer.css';

const TextContainer = ({ users, messages }) => {

    return (
        <div className="textContainer">
            {
                users
                    ? (
                        <div>
                            <h1>People currently chatting:</h1>
                            <div className="activeContainer">
                                <h4>
                                    {users.map(({ name }) => (
                                        <div key={name} className="activeItem">
                                            {name}
                                            <img alt="Online Icon" src={onlineIcon} />
                                        </div>
                                    ))}
                                </h4>
                            </div>
                        </div>
                    )
                    : null
            }

            {
                messages
                ? (
                    <div>
                        <h1>Last 5 Messages:</h1>
                        <div className="activeContainer">
                            <h4>
                                {messages.map(({ message }) => (
                                    <div key={message} className="activeItem">
                                        {message}
                                    </div>
                                ))}
                            </h4>
                        </div>
                    </div>
                )
                : null
            }
        </div>
    );
}



export default TextContainer;