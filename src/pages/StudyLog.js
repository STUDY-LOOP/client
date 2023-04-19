import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import LayoutMain from '../components/LayoutMain';
import './style/StudyLog.css'
import './style/Common.css'

import PageLink from '../components/PageLink';
import MeetAttendance from '../components/MeetAttendance';

const SERVER_URI = 'http://localhost:3000';

function StudyLog() {
    const { log } = useParams();

    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("initial");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [date, setDate] = useState("");

    useEffect(() => {
        axios.all([
            axios.get(`${SERVER_URI}/api/event/${log}`),
            axios.get(`${SERVER_URI}/api/log/${log}`),
        ]).then(
            axios.spread((res1, res2) => {
                var dateInfo = res1.data[0].date_start; 
                setContent(res2.data.content);
                toDate(dateInfo);
            })
        ).catch((err) => console.log(err));
    }, []);

    const handleOnClick = (arg) => {
        setModalIsOpen(true);
    };

    const toDate = (dateInfo) => {
        setDate(dateInfo.substring(5, 10));
    };

    return (
        <div class="div-layout-upper">
            <div class="div-layout-lower-1">
                <LayoutMain />
            </div>

            <div id="div-studylog" class="div-layout-lower-2">
                <div class="div-page-header">
                    
                    <h1>{date} 로그</h1>
                </div>  
                
                <div id="div-minutes">
                    <div class="div-component-header">
                        회의록
                    </div>
                    <div class="div-component">
                        {content}
                        <button type="button" onClick={handleOnClick}>수정하기</button>

                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={() => { setModalIsOpen(false); }}
                            ariaHideApp={false}
                        >
                            회의록
                        </Modal>
                    </div>
                </div>

                <div id="div-attendance">
                    <div class="div-component-header">
                        출석부
                    </div>
                    <div class="div-component">
                        <MeetAttendance

                        />
                    </div>
                </div>

                <div id="div-assignment">
                    <div class="div-component-header">
                        과제함
                    </div>
                    <div class="div-component">

                    </div>

                </div>

            </div> <hr />

        </div >
    );
}

export default StudyLog;
