import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Popover, OverlayTrigger, Form } from "react-bootstrap";
import { Box, List, ListItem } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import LayoutMain from '../components/LayoutMain';
import Submitted from '../components/SubmittedAssignment';
import AssignmentBox from '../components/AssignmentBox';
import EachAssignment from '../components/EachAssignment';
import LayoutStudyPage from '../components/LayoutStudyPage';
import CalculateDue from '../components/CalculateDue';

import './style/CalendarAssignment.css';
import './style/Common.css';
import { Calculate } from "@mui/icons-material";

const SERVER_URI = 'http://localhost:3000';

function CalendarAssignment() {
    const { gpId, boxId } = useParams();
    const my_nick = sessionStorage.getItem('user_nick');
    let my_email;

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState([]);
    const [file, setFiles] = useState([]);
    const [submittedFile, setSubmittedFiles] = useState([]);
    const [members, setMembers] = useState([]);
    const [info, setInfos] = useState([]);
    const [myAsgmt, setMyAsgmt] = useState(false);
    const [myFile, setMyFiles] = useState([]);

    useEffect(() => {
        my_email = sessionStorage.getItem('user_email');
        axios.all([
            axios.get(`${SERVER_URI}/api/${boxId}`),
            axios.get(`${SERVER_URI}/api/${gpId}/member`),
            axios.get(`${SERVER_URI}/api/${gpId}/info`),
            axios.get(`${SERVER_URI}/api/user/${my_email}/assignment/${boxId}`),
        ]).then(
            axios.spread((res1, res2, res3, res4) => {
                setAssignments(res1.data);
                setSubmittedFiles(res1.data.Assignments);
                setMembers(res2.data);
                setInfos(res3.data);
                setMyFiles(res4.data);
                setLoading(false);
            })
        ).then(() => {
            submittedFile && submittedFile.map(asgmt => { if (asgmt.uploader === my_email) setMyAsgmt(true); });
            console.log(submittedFile);
        }
        ).catch((err) => console.log(err));
    }, []);


    const onChange = (event) => {
        setFiles(event.target.files[0]);
    };

    const upload = async (event) => {
        event.preventDefault();
        let jsonData = JSON.stringify({
            gpId: gpId,
            boxId: boxId,
            uploader: sessionStorage.getItem('user_email'),
        });

        const formData = new FormData();
        formData.append('fileData', file);
        formData.append('jsonData', jsonData);

        await axios.post(`${SERVER_URI}/api/assignment`, formData);
    };

    const onClickToDetail = () => { navigate(`/study-group/${gpId}/log/${assignments.log}`) };
    const onClickToBoxes = () => { navigate(`/study-group/${gpId}/assignment`) };


    return (
        <>
            <div class="div-layout-upper">
                <div class="div-layout-lower-1">
                    <LayoutMain />
                </div>

                <div id="div-scroll-main" class="div-layout-lower-2">
                    {loading ? <h2>loading...</h2> :
                        <div id="div-layout-grid">
                            <div id="div-layout-1" className="layout-study">
                                <LayoutStudyPage
                                    gpId={gpId}
                                    groupName={info.groupName}
                                />
                            </div>

                            <div id="div-grid-cal-asgmt">
                                <div id="div-layout-2" className="layout-cal-asgmt">
                                    <h3><strong>{assignments.title}</strong></h3>
                                    <CalculateDue
                                        describe={assignments.content}
                                        inputDate={assignments.deadline}
                                    />
                                </div>

                                <div id="div-btn-detail">
                                    <Button onClick={onClickToDetail} size="sm">세부 페이지로</Button>
                                </div>

                                <div id="div-my-asgmt">
                                    {myAsgmt
                                        ? <div id="div-my-yes">
                                            <h4>내 과제 &nbsp;

                                                <OverlayTrigger
                                                    id="trigger-asgmt"
                                                    placement="bottom"
                                                    trigger="click"
                                                    overlay={
                                                        <Popover>
                                                            <Popover.Header as="h3">과제 제출</Popover.Header>
                                                            <Popover.Body>
                                                                <>
                                                                    <Form
                                                                        style={{ float: 'left', width: '78%' }}
                                                                        encType="multipart/form-data"
                                                                    >
                                                                        <Form.Control id="file-input" type="file" size="sm" name="fileData" onChange={onChange} />
                                                                    </Form>

                                                                    <Button
                                                                        style={{ float: 'right', width: '20%' }}
                                                                        size="sm"
                                                                        onClick={upload}>
                                                                        제출
                                                                    </Button>
                                                                    <br /><br />
                                                                </>
                                                            </Popover.Body>
                                                        </Popover>
                                                    }
                                                >
                                                    <Button variant="outline-secondary" size="sm">추가 제출</Button>
                                                </OverlayTrigger>
                                            </h4>

                                            <List>
                                                {myFile.map(
                                                    (asgmt) =>
                                                        <Submitted
                                                            key={asgmt.filename}
                                                            gpId={gpId}
                                                            uploader={asgmt.uploader}
                                                            filename={asgmt.filename}
                                                            fileOrigin={asgmt.fileOrigin}
                                                            submittedOn={asgmt.submittedOn}
                                                            userNick={my_nick}
                                                            deadline={assignments.deadline}
                                                            forOneBox={true}
                                                            state={asgmt.submitState}
                                                        />
                                                )}
                                            </List>
                                        </div>

                                        : <div id="div-my-no">
                                            <h4>내 과제</h4>
                                            <Form
                                                style={{ float: 'left', width: '78%' }}
                                                encType="multipart/form-data"
                                            >
                                                <Form.Control id="file-input" type="file" size="sm" name="fileData" onChange={onChange} />
                                            </Form>

                                            <Button
                                                style={{ float: 'right', width: '20%' }}
                                                size="sm"
                                                onClick={upload}>
                                                과제 제출
                                            </Button>
                                        </div>
                                    }
                                </div>

                                <div id="div-all-asgmts">
                                    <h4>과제 전체보기</h4>
                                    <List>
                                        {Object.keys(submittedFile).length !== 0 ?
                                            <>{submittedFile && submittedFile.map(
                                                (asgmt) =>
                                                    <Submitted
                                                        key={asgmt.filename}
                                                        gpId={gpId}
                                                        uploader={asgmt.uploader}
                                                        filename={asgmt.filename}
                                                        fileOrigin={asgmt.fileOrigin}
                                                        submittedOn={asgmt.submittedOn}
                                                        userNick={asgmt.User.userNick}
                                                        deadline={assignments.deadline}
                                                        forOneBox={true}
                                                        state={asgmt.submitState}
                                                    />
                                            )}</>
                                            :
                                            <ListItem disablePadding>
                                                <ListItemButton>
                                                    <ListItemText primary="제출된 과제 없음" />
                                                </ListItemButton>
                                            </ListItem>
                                        }
                                    </List>
                                </div>

                                <div id="div-btn-boxes">
                                    <Button onClick={onClickToBoxes} size="sm">전체 과제함</Button>
                                </div>

                                <div id="div-no-submit">
                                    미제출자
                                    {members.map(
                                        member => (
                                            <EachAssignment
                                                userId={member.email}
                                                userNick={member.userNick}
                                                assignment={assignments.Assignments}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    }
                </div>




            </div>
        </>
    );
}

export default CalendarAssignment;