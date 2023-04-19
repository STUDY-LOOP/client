import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SERVER_URI = 'http://localhost:3000';

function LayoutStudyPage({ gpId, groupName, leader, rule }) {

    const navigate = useNavigate();

    const onClickTitle = () => {
        navigate(-1);
    }
    
    return (
        <div>
            <h1 onClick={onClickTitle}>
                <b>{groupName}</b>
            </h1>
            {rule}
        </div>
    )
}

export default LayoutStudyPage;