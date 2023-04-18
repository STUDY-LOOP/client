import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import PageLink from '../components/PageLink';

const SERVER_URI = 'http://localhost:3000';

function StudyLog() {
    const { gpId, log } = useParams();

    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("initial");
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        axios.get(`${SERVER_URI}/api/log/${log}`)
            .then((res) => setContent(res.data.content));
    }, []);

    const handleOnClick = (arg) => {
        setModalIsOpen(true);
    };


    return (
        <>
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
            </div> <hr />

            <div>
                과제함
            </div>

        </>
    );
}

export default StudyLog;
