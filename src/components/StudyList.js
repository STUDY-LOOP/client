import { Link, useNavigate } from 'react-router-dom';
import './style/StudyList.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

function StudyList({ gpId, groupName, groupDesc }) {
  const imgNum = Math.floor(Math.random() * 13) + 1;
  const imgUrl = `cover/${imgNum}.jpg`;
  const navigate = useNavigate();
  const onClick = () => {
    navigate(`/study-group/${gpId}`);
  };

  return (

    <Card sx={{ maxWidth: 230 }} style={{ marginTop: '25px' }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={imgUrl}
          onClick={onClick}
        />
        <CardContent
          onClick={onClick}
        >
          <Typography gutterBottom variant="h5" component="div">
            {groupName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {groupDesc}
          </Typography>
        </CardContent>
      </CardActionArea>

    </Card>
  );
}

export default StudyList;
