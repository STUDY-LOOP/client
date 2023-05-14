import { Link, useNavigate } from 'react-router-dom';
// import './style/StudyList.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card } from "react-bootstrap";

function SearchResult({ gpId, groupName, groupLeader, groupDesc }) {

    const navigate = useNavigate();
    const onClick = () => { navigate(`/study-group/${gpId}`); }

    return (
        <>
            <h2 onClick={onClick}>{groupName}</h2>
            <p>{groupDesc}</p>
            <br/>
        </>
    )
}

export default SearchResult;