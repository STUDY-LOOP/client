import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import './style/Calendar.css';

const SERVER_URI = 'http://localhost:3000';

function StudyLog() {
    const { gpId } = useParams();

    return (
        <>
            스터디 로그입니다
        </>
    );
}

export default StudyLog;