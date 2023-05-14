import { Link, useNavigate } from 'react-router-dom';
import './style/StudyList.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card } from "react-bootstrap";

function StudyList({ gpId, groupName, groupDesc }) {

    const imgNum = Math.floor(Math.random() * 13) + 1;
    const imgUrl = `cover/${imgNum}.jpg`;
    const navigate = useNavigate();
    const onClick = () => { navigate(`/study-group/${gpId}`); }

    return (
        <div>
            <Card style={{ width: '15rem' }}>
                <Card.Img variant="top" src={imgUrl} />
                <Card.Body>
                    <Card.Title>{groupName}</Card.Title>
                    <Card.Text>
                        {groupDesc}
                    </Card.Text>
                    <Button variant="primary" onClick={onClick}>스터디 입장하기</Button>
                </Card.Body>
            </Card>
        </div>
    )
}

export default StudyList;