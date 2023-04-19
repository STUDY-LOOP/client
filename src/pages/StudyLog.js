import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import PageLink from '../components/PageLink';
import MeetAttendance from '../components/MeetAttendance';

const SERVER_URI = 'http://localhost:3000';

function StudyLog() {
    const { log } = useParams();

    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("initial");
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        axios.all([
            axios.get(`${SERVER_URI}/api/log/${log}`),
        ]).then(
            axios.spread((res1, res2) => {
                setContent(res1.data.content);
            })
        ).catch((err) => console.log(err));
    }, []);

    const handleOnClick = (arg) => {
        setModalIsOpen(true);
    };

    return (
        <>
            <div>
                <PageLink
                    link={'/'}
                    title={'메인화면으로'}
                />
            </div> <hr />

            <div>
                {content}
                <button type="button" onClick={handleOnClick}>수정하기</button>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => { setModalIsOpen(false); }}
                    ariaHideApp={false}
                >
                    회의록
                </Modal>
            </div> <hr />


            <div>
                출석부
                <MeetAttendance
                
                />

            </div> <hr />

            <div>
                과제함
            </div>

        </>
    );
}

export default StudyLog;
