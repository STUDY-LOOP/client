import { Link, useNavigate } from 'react-router-dom';
import './style/StudyList.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card } from 'react-bootstrap';

function StudyList({ gpId, groupName, groupDesc }) {
  const imgNum = Math.floor(Math.random() * 13) + 1;
  const imgUrl = `cover/${imgNum}.jpg`;
  const navigate = useNavigate();
  const onClick = () => {
    navigate(`/study-group/${gpId}`);
  };

  return (
    <Card
      id="study-main-card"
      style={{
        width: '15rem',
        height: '22rem',
        marginTop: '20px',
      }}
    >
      <Card.Img variant="top" src={imgUrl} id="study-card-img" />
      <Card.Body>
        <Card.Title id="study-card-title">{groupName}</Card.Title>
        <Card.Text id="study-card-text">{groupDesc}</Card.Text>
        <Button variant="success" onClick={onClick} id="study-card-button">
          스터디 입장하기
        </Button>
      </Card.Body>
    </Card>
  );
}

export default StudyList;
