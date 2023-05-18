import { useState } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";

// import { ListItem, ListItemButton } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import Face1 from '@mui/icons-material/Face';
import Face2 from '@mui/icons-material/Face2';
import Face3 from '@mui/icons-material/Face3';
import Face4 from '@mui/icons-material/Face4';
import Face5 from '@mui/icons-material/Face5';
import Face6 from '@mui/icons-material/Face6';

const SERVER_URI = 'http://localhost:3000';

function SubmittedAssignment({ gpId, uploader, filename, fileOrigin, userNick, submittedOn, deadline, forOneBox, state }) {

    const icon = Math.floor(Math.random() * 6) + 1;

    // 시간 계산
    const submittedOnD = new Date(submittedOn);
    const deadlineD = new Date(deadline);
    const gap = submittedOnD.getTime() - deadlineD.getTime();
    const days = Math.floor(gap / 86400000);
    const hours = Math.floor((gap % 86400000) / 3600000);
    const minutes = Math.floor(((gap % 86400000) % 3600000) / 60000) + 1;

    let time;
    if (days > 0) time = `${days}일 ${hours}시간`
    else if (hours > 0) time = `${hours}시간 ${minutes}분`
    else time = `${minutes}분`


    const onClick = () => {
        //event.preventDefault();
        axios.delete(`${SERVER_URI}/api/assignment`, {
            data: {
                filename: filename,
                gpId: gpId,
            }
        });

        window.location.reload();
    };

    return (
        <>
            {forOneBox
                ?
                // 개별 과제함
                <>
                    {filename ?
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {icon === 1 ? <Face1 /> : <>{icon === 2 ? <Face2 /> : <>{icon === 3 ? <Face3 /> : <>{icon === 4 ? <Face4 /> : <>{icon === 5 ? <Face5 /> : <>{icon === 6 ? <Face6 /> : null}</>}</>}</>}</>}</>}
                                </ListItemIcon>
                                <ListItemText primary={userNick} />
                                <a href={`${SERVER_URI}/api/download/${filename}`} download>{fileOrigin}</a>
                            </ListItemButton>
                        </ListItem>
                        : null
                    }
                </>

                :
                // 과제함 전체보기
                <>
                    {filename ?
                        <tr>
                            <td><a href={`${SERVER_URI}/api/download/${filename}`} download>{fileOrigin}</a></td>
                            <td>{userNick}</td>
                            <td>
                                {gap > 0 ? <>지각({time})</> : null}
                            </td>

                            {uploader === sessionStorage.getItem('user_email')
                                ? <Button variant="outline-success" size="sm" onClick={onClick}>삭제</Button>
                                : null}
                        </tr>
                        : null
                    }
                </>

            }
        </>
    )
}

export default SubmittedAssignment;