import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import axios from 'axios';

import AddEvent from './AddEvent';
import StudyLog from './StudyLog';
import './style/Calendar.css';

const SERVER_URI = 'http://localhost:3000';

function Calendar() {
    const { gpId } = useParams();

    const [loading, setLoading] = useState(true);
    const [groupEvents, setGroupEvents] = useState([]);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [logModalIsOpen, setLogModalIsOpen] = useState(false);
    // const [asgmtModalIsOpen, setAsgmtModalIsOpen] = useState(false);
    const [clickedDate, setClickedDate] = useState(null);

    const callApi = async () => {
        await axios.get(`${SERVER_URI}/api/${gpId}/event`)
            .then((res) => {
                setGroupEvents(res.data);
                setLoading(false);
                console.log(res.data);
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        callApi();
    }, []);

    const handleDateClick = (arg) => {
        setAddModalIsOpen(true);
        setLogModalIsOpen(false);
        // setAsgmtModalIsOpen(false);
        setClickedDate(arg.dateStr);
    }

    const handleEventClick = (arg) => {
        const event_type = arg.event._def.extendedProps.event_type;
        // 스터디
        if (event_type == 0) {
            setLogModalIsOpen(true);
            setAddModalIsOpen(false);
            // setAsgmtModalIsOpen(false);
        }
        // 과제
        else if (event_type == 1) {
            let boxId = arg.event._def.extendedProps.boxId;
            window.location.href = `/study-group/${gpId}/${boxId}`;

            // setAsgmtModalIsOpen(true);
            setLogModalIsOpen(false);
            setAddModalIsOpen(false);
        }
    }

    return (
        <>
            <div className="modalDiv">
                <Modal
                    className="modal"
                    isOpen={addModalIsOpen}
                    onRequestClose={() => { setAddModalIsOpen(false); }}
                    ariaHideApp={false}
                >
                    <AddEvent
                        date_start={clickedDate}
                    />

                </Modal>

                <Modal
                    className="modal"
                    isOpen={logModalIsOpen}
                    onRequestClose={() => setLogModalIsOpen(false)}
                    ariaHideApp={false}
                >
                    <StudyLog />
                </Modal>
            </div>

            <div id="calendarDiv">
                <FullCalendar
                    className="calendar"
                    defaultView="dayGridMonth"
                    plugins={[dayGridPlugin, interactionPlugin]}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    events={groupEvents}
                />
            </div>
        </>
    );
}

export default Calendar;