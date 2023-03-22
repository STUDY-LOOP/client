import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import DateTimePicker from 'react-datetime-picker';
import Modal from 'react-modal';
import axios from 'axios';

import AssignmentBox from '../components/AssignmentBox';

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
    const [deadline, setDeadline] = useState("");
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
        <div>
            {/* 과제함 생성 모달 */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => { setModalIsOpen(false); }}
                ariaHideApp={false}
            >
                <form>
                    log <input type="input" onChange={logHandler} required /> <br />
                    title <input type="input" onChange={titleHandler} required /> <br />
                    content <input type="input" onChange={contentHandler} required /> <br />
                    deadline <DateTimePicker onChange={setStartDateTime} value={startDateTime} format="y-MM-dd a h:mm" /> <br />
                    <button type="button" onClick={onClickCreate}>과제함 생성</button>
                </form>
            </Modal>
            <button onClick={handleModal}>과제함 추가하기</button>

            <hr />

            {/* 과제제출여부 */}
            <div>
                {loading ? <h3>LOADING...</h3> : assignments.map(
                    (assignment) =>
                        <AssignmentBox
                            gpId={gpId}
                            boxId={assignment.boxId}
                            title={assignment.title}
                            Assignments={assignment.Assignments}
                        />

                )}
            </div>
        </div>
    );
}

export default StudyMember;