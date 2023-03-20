import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';

import './style/Calendar.css';

const SERVER_URI = 'http://localhost:3000';

function AddEvent({ date_start }) {
    const { gpId } = useParams();
    let ini_date;

    // -- 이벤트 등록 -- //
    const [eventTitle, setEventTitle] = useState(null);
    const [type, setType] = useState(null);
    const [startDateTime, setStartDateTime] = useState(date_start);
    const [endDateTime, setEndDateTime] = useState(date_start);

    const color = ['#088A29', '#5882FA', '#FACC2E'];    // 초록 파랑 주황

    useEffect(() => {
        ini_date = new Date(date_start);
        setStartDateTime(ini_date);
        setEndDateTime(ini_date)
    }, [date_start])

    useEffect(() => {
        if (startDateTime > endDateTime) {
            window.alert('시작일 이후의 날짜를 선택하세요.');
            setEndDateTime(startDateTime);
        }
    }, [endDateTime])


    const eventTitleInputHandler = (event) => { event.preventDefault(); setEventTitle(event.target.value); };
    const typeInputHandler = (event) => {
        event.preventDefault();
        setType(event.target.value);

        const btnAddEvent = document.getElementById("button-add-event");
        const divCreateAsgmt = document.getElementById("div-create-asgmt");
        const divPicker = document.getElementById("picker");
        const divPickers = document.getElementById("pickers");

        //스터디
        if (event.target.value === "0") {
            btnAddEvent.style.display = 'block';
            divCreateAsgmt.style.display = 'none'
            divPicker.style.display = 'block';
            divPickers.style.display = 'none';
            setEndDateTime(startDateTime);
        }
        //과제 마감
        else if (event.target.value === "1") {
            btnAddEvent.style.display = 'none';
            divCreateAsgmt.style.display = 'block';
            divPicker.style.display = 'block';
            divPickers.style.display = 'none';
            setEndDateTime(startDateTime);
        }
        //기타
        else {
            btnAddEvent.style.display = 'block';
            divCreateAsgmt.style.display = 'none';
            divPicker.style.display = 'none';
            divPickers.style.display = 'block';
        };
    };

    const onClickAddEvent = async () => {
        await axios
            .post(`${SERVER_URI}/api/event`, {
                gpId: gpId,
                event_title: eventTitle,
                event_type: type,
                date_start: startDateTime,
                date_end: endDateTime,
                event_color: color[Number(type)],
            }, {
                withCredentials: true
            })
            .catch(err => alert(err));
    }


    // -- 과제함 생성 -- //
    const [log, setLog] = useState("");
    const [content, setContent] = useState("");

    const logHandler = (event) => { event.preventDefault(); setLog(event.target.value); };
    const contentHandler = (event) => { event.preventDefault(); setContent(event.target.value); };

    const onClickAsgmt = async (event) => {
        event.preventDefault()

        axios.post(`${SERVER_URI}/api/assignmentBox`, {
            gpId: gpId,
            log: log,
            title: eventTitle,
            content: content,
            deadline: date_start,
        })
        .then(res => {
            axios.post(`${SERVER_URI}/api/event`, {
                gpId: gpId,
                event_title: eventTitle,
                event_type: type,
                date_start: date_start,
                event_color: color[Number(type)],
                boxId: res.data,
            })
        })
        .then(() => window.location.replace(`/study-group/${gpId}`))
        .catch((err) => alert(err));
    };

    /* const onClickAsgmt = async () => {

        await axios.all([
            axios.post(`${SERVER_URI}/api/event`, {
                gpId: gpId,
                event_title: eventTitle,
                event_type: type,
                date_start: date_start,
                event_color: color[Number(type)],
            }),
            axios.post(`${SERVER_URI}/api/assignmentBox`, {
                gpId: gpId,
                log: log,
                title: eventTitle,
                content: content,
                deadline: date_start,
            }),
        ])
        .then(() => window.location.replace(`/study-group/${gpId}`))
        .catch(err => alert(err));
    }; */


    return (
        <>
            <div id="picker">
                <DateTimePicker onChange={setStartDateTime} value={startDateTime} format="y-MM-dd h:mm:ss a" />
            </div>
            <div id="pickers" style={{ display: "none" }}>
                <DateTimePicker onChange={setStartDateTime} value={startDateTime} format="y-MM-dd h:mm:ss a" />~
                <DateTimePicker onChange={setEndDateTime} value={endDateTime} format="y-MM-dd h:mm:ss a" /> <br />
            </div>

            <label htmlFor="title">TITLE</label>
            <input type="text" name="title" onChange={eventTitleInputHandler} required /> <br />

            <label htmlFor="type">TYPE</label>
            <select name="type" onChange={typeInputHandler} required>
                <option value="-1" selected="true" disabled="disabled" hidden>일정의 종류를 선택하세요</option>
                <option value="0">스터디</option>
                <option value="1">과제 마감</option>
                <option value="2">기타</option>
            </select><br />

            <button id="button-add-event" onClick={onClickAddEvent}>일정 등록</button>

            <div id="div-create-asgmt" style={{ display: "none" }}>
                <form>
                    <input type="hidden" value="{{groupPublicId}}" name="gpId" /> <br />
                    log <input type="input" onChange={logHandler} /> <br />
                    content <input type="input" onChange={contentHandler} /> <br />
                    <button type="button" onClick={onClickAsgmt}>과제함 생성</button>
                </form>
            </div>

        </>
    );
}

export default AddEvent;