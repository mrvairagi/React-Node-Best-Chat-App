import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';


const IndexPage = () => {
    
    let navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("CC_Token");
        
        if (!token) {
            navigate("/login", { replace: true });
        } else {
            navigate("/chatRoom");
        }

    }, [0]);
    return <div></div>;
};

export default IndexPage;