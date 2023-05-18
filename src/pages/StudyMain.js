import { useEffect, useState, MouseEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import BootstrapMenu from "bootstrap-menu";

import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from "react-bootstrap";

import LayoutMain from '../components/LayoutMain';
import PageLink from '../components/PageLink';
import Chat from '../components/Chat';
import LayoutStudyPage from '../components/LayoutStudyPage';
import AddEvent from '../components/AddEvent';

import '../components/style/Calendar.css'
import './style/StudyMain.css';
import './style/Common.css';

const SERVER_URI = 'http://localhost:3000';

function StudyMain() {
    const { gpId } = useParams();
    const userEmail = sessionStorage.getItem("user_email");
    const navigate = useNavigate();

    // 스터디 정보 관련
    const [loading, setLoading] = useState(true);
    const [studyInfo, setStudyInfo] = useState([]);
    const [studyRule, setStudyRule] = useState("");
    const [studySchedule, setStudySchedule] = useState([]);
    const [studyMembers, setStudyMembers] = useState([]);
    let membersEmail = [];

    // 캘린더 관련
    const [groupEvents, setGroupEvents] = useState([]);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [clickedDate, setClickedDate] = useState(null);

    useEffect(() => {
        axios.all([
            axios.get(`${SERVER_URI}/api/${gpId}/info`),
            axios.get(`${SERVER_URI}/api/${gpId}/member`),
            axios.get(`${SERVER_URI}/api/${gpId}/event`),
        ]).then(
            axios.spread((res1, res2, res3) => {
                setStudyInfo(res1.data);
                setStudyRule(res1.data.StudyRule);
                setStudySchedule(res1.data.StudySchedule);
                setStudyMembers(res2.data);
                setGroupEvents(res3.data);

                res2.data.map((m) => membersEmail.push(m.email));
                console.log(membersEmail.includes(userEmail))
                setLoading(false);
            })
        ).catch((err) => console.log(err));

    }, []);

    const onClickJoin = async () => {
        await axios
            .post(`${SERVER_URI}/api/group/member`, {
                gpId: gpId,
            })
            .then(res => res)
            .then(result => {
                if (result.data.code == 0) {
                    alert("스터디 그룹 가입 완료");
                    window.location.href = '/';
                }
            })
            .catch(err => alert(err));
    }

    // 기본 버튼
    const onClickMember = () => { window.location.href = (`/study-group/${gpId}/member`) }
    const onClickStudyInfo = () => { window.location.href = (`/study-group/${gpId}/studyinfo`) }
    const onClickAssignment = () => { window.location.href = (`/study-group/${gpId}/assignment`) }
    const onClickEnterVideo = () => { window.location.href = (`/study-group/${gpId}/videoChat`) }

    // 캘린더 관련
    const handleDateClick = (arg) => {
        setAddModalIsOpen(true);
        setClickedDate(arg.dateStr);
    }

    const handleEventClick = (arg) => {
        const event_type = arg.event._def.extendedProps.event_type;
        // 스터디
        if (event_type == 0) {
            let log = arg.event._def.extendedProps.log;

            navigate(`/study-group/${gpId}/log/${log}`);
            setAddModalIsOpen(false);
        }
        // 과제
        else if (event_type == 1) {
            let boxId = arg.event._def.extendedProps.boxId;
            navigate(`/${gpId}/asgmt/${boxId}`);
            setAddModalIsOpen(false);
        }
    }

    const handleEventRender = info => {
        let { event, el } = info;
        new BootstrapMenu(el, {
            actions: [
                {
                    name: "Action",
                    onClick: function () {
                        alert("'Action' clicked!");
                    }
                },
                {
                    name: "Another action",
                    onClick: function () {
                        console.log("'Another action' clicked!");
                    }
                },
                {
                    name: "A third action",
                    onClick: function () {
                        console.log("'A third action' clicked!");
                    }
                }
            ]
        });
    }

    return (
        <div class="div-layout-upper">

            <div class="div-layout-lower-1">
                <LayoutMain />
            </div>

            <div id="div-studymain" class="div-layout-lower-2-custom-studymain">
                <Modal
                    show={addModalIsOpen}
                    onHide={() => { setAddModalIsOpen(false); }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>일정 추가하기</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <AddEvent
                            date_start={clickedDate}
                        />
                    </Modal.Body>
                </Modal>

                <div id="div-grid" class="top">
                    <div id="div-info">
                        <LayoutStudyPage
                            gpId={studyInfo.groupPublicId}
                            groupName={studyInfo.groupName}
                            leader={studyInfo.leader}
                            rule={studyRule.rule}
                            lateTime={studyRule.lateTime}
                            lateFee={studyRule.lateFee}
                            absentTime={studyRule.absentTime}
                            absentFee={studyRule.absentFee}
                            description={studyInfo.groupDescription}
                        />
                    </div>

                    <div id="div-chat">
                        <Chat />
                    </div>

                    <div id="div-calendar">
                        <FullCalendar
                            className="calendar"
                            defaultView="dayGridMonth"
                            plugins={[dayGridPlugin, interactionPlugin]}
                            dateClick={handleDateClick}
                            eventClick={handleEventClick}
                            events={groupEvents}
                            height={500}
                            eventRender={handleEventRender}
                        />

                        <div id="div-comp-add-event" style={{ display: "none" }}>
                            <AddEvent
                                date_start={clickedDate}
                            />
                        </div>
                    </div>

                    <div id="div-btn">
                        {/* 로그인 안했거나 || 스터디장이거나 || 스터디원이라면 -> 가입 불가 */}
                        {userEmail === null || userEmail === studyInfo.groupLeader || membersEmail.includes(userEmail)
                            ?
                            <>

                            </>

                            :
                            <><Button variant="success" type="button" onClick={onClickJoin}>스터디 가입하기</Button>&nbsp;</>

                        }

                        {userEmail === studyInfo.groupLeader ?
                            <><Button variant="success" type="button" onClick={onClickStudyInfo}>스터디 설정</Button>&nbsp;</>
                            : null}
                        <Button variant="success" onClick={onClickMember}>스터디 정보</Button> &nbsp;
                        <Button variant="success" type="button" onClick={onClickAssignment}>과제함</Button> &nbsp;

                    </div>

                    <div id="div-video">
                        <Button variant="success" type="button" onClick={onClickEnterVideo}>화상회의</Button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default StudyMain;
