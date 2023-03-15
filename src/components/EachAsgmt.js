import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';

import './style/Calendar.css';

const SERVER_URI = 'http://localhost:3000';

function EachAsgmt() {
    const { gpId } = useParams();
    const [assignments, setAssignments] = useState([]);  

    return (
        <>
            과제함
        </>
    );
}

export default EachAsgmt;