import { useEffect, useState } from "react";
import { redirect, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import PageLink from './PageLink';

const SERVER_URI = 'http://localhost:3000';

function MemberWithQuitBtn({ email, nick, gpId }) {
    let navigate = useNavigate(); 

    const onClick = (event) => {
        //event.preventDefault();
        axios.delete(`${SERVER_URI}/api/member`, {
            data: {
                memberEmail: email,
                gpId: gpId,
            }
        });
    };

    return (
        <p>
            {nick} <button onClick={onClick}>스터디 탈퇴하기</button>
        </p>
    )
}

export default MemberWithQuitBtn;