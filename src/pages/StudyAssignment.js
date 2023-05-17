import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import DateTimePicker from 'react-datetime-picker';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Accordion, Form, Modal } from "react-bootstrap";

import LayoutMain from '../components/LayoutMain';

import AssignmentBox from '../components/AssignmentBox';
import LayoutStudyPage from '../components/LayoutStudyPage';
import './style/StudyAssignment.css';
import './style/Common.css';

const SERVER_URI = 'http://localhost:3000';

function StudyMember() {

    const { gpId } = useParams();
    const [loading, setLoading] = useState(true);

    const [studyInfo, setStudyInfo] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [log, setLog] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [startDateTime, setStartDateTime] = useState(new Date(Date.now()));

    useEffect(() => {
        axios.all([
            axios.get(`${SERVER_URI}/api/${gpId}/info`),
            axios.get(`${SERVER_URI}/api/${gpId}/assignment`),
        ]).then(
            axios.spread((res1, res2) => {
                setStudyInfo(res1.data);
                setAssignments(res2.data);
                setLoading(false);
            })
        ).catch((err) => console.log(err));
    }, []);

    const logHandler = (event) => { event.preventDefault(); setLog(event.target.value); };
    const titleHandler = (event) => { event.preventDefault(); setTitle(event.target.value); };
    const contentHandler = (event) => { event.preventDefault(); setContent(event.target.value); };

    const handleModal = (arg) => {
        setModalIsOpen(true);
    }

    const onClickCreate = async () => {
        await axios.post(`${SERVER_URI}/api/assignmentBox`, {
            gpId: gpId,
            log: log,
            title: title,
            content: content,
            deadline: startDateTime,
        })
            .then(res => {
                axios.post(`${SERVER_URI}/api/event`, {
                    gpId: gpId,
                    event_title: title,
                    event_type: '1',
                    date_start: startDateTime,
                    date_end: null,
                    event_color: '#5882FA',
                    boxId: res.data,
                })
            })
            .then(() => {
                setModalIsOpen(false);
                window.location.reload()
            })
            .catch((err) => alert(err));
    };

    return (
        <div class="div-layout-upper">
            <div class="div-layout-lower-1">
                <LayoutMain />
            </div>
            <div id="div-scroll" class="div-layout-lower-2">
                <div id="div-grid-asgmt">
                    <div id="div-layout">
                        <LayoutStudyPage
                            gpId={studyInfo.groupPublicId}
                            groupName={studyInfo.groupName}
                        />
                    </div>

                    <div id="div-asgmt-layout">
                        <h3>과제함</h3>

                        <Modal show={modalIsOpen} onHide={() => { setModalIsOpen(false); }}>
                            <Modal.Header closeButton>
                                <Modal.Title><h2><strong>새 과제함 만들기</strong></h2></Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" controlId="formLog">
                                        <Form.Label><h5><strong>스터디 로그</strong></h5></Form.Label>
                                        <Form.Control type="input" onChange={logHandler} required />
                                        <Form.Text className="text-muted">
                                            과제와 연동되는 스터디 회차를 알려주세요
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label><h5><strong>과제명</strong></h5></Form.Label>
                                        <Form.Control type="input" placeholder="과제명을 적어주세요" onChange={titleHandler} required />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label><h5><strong>과제 설명</strong></h5></Form.Label>
                                        <Form.Control type="text" placeholder="과제에 대해 설명해주세요" onChange={contentHandler} required />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label><h5><strong>마감일</strong></h5></Form.Label> <br />
                                        <DateTimePicker onChange={setStartDateTime} value={startDateTime} format="y-MM-dd a h:mm" />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button type="button" onClick={onClickCreate}>과제함 생성</Button>
                            </Modal.Footer>
                        </Modal>

                        <div>
                            <Button onClick={handleModal}>과제함 추가하기</Button>
                        </div>
                    </div>



                    {/* 과제제출여부 */}
                    <Accordion defaultActiveKey="0" alwaysOpen>
                        {loading ? <h3>LOADING...</h3> : assignments.map(
                            (assignment) =>
                                <AssignmentBox
                                    gpId={gpId}
                                    boxId={assignment.boxId}
                                    title={assignment.title}
                                    content={assignment.content}
                                    deadline={assignment.deadline}
                                    Assignments={assignment.Assignments}
                                />

                        )}
                    </Accordion>
                </div>
            </div>
        </div>
    );
}

export default StudyMember;