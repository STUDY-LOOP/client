import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Accordion, Form, Modal } from "react-bootstrap";

import AssignmentBox from '../components/AssignmentBox';
import LayoutMain from '../components/LayoutMain';
import './style/StudyLog.css';
import './style/Common.css';

import MeetAttendance from '../components/MeetAttendance';

const SERVER_URI = 'http://localhost:3000';

function StudyLog() {
	const { gpId, log } = useParams();

	const [loading, setLoading] = useState(true);
	const [content, setContent] = useState(null);
	const [assignments, setAssignments] = useState([]);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [date, setDate] = useState("");

	useEffect(() => {
		axios.all([
			axios.get(`${SERVER_URI}/api/event/${log}`),
			axios.get(`${SERVER_URI}/api/log/${log}`),
			axios.get(`${SERVER_URI}/api/${gpId}/assignment`),
		]).then(
			axios.spread((res1, res2, res3) => {
				var dateInfo = res1.data[0].date_start;
				setContent(res2.data.content);
				setAssignments(res3.data);
				toDate(dateInfo);
				setLoading(false);
			})
		).catch((err) => console.log(err));
	}, []);

	const handleCloseOnClick = async () => {
		setModalIsOpen(false);
		await axios.post(`${SERVER_URI}/api/log/${log}/modify`, {
			newContent: content,
		});
	};

	const handleOnClickModal = () => {
		setModalIsOpen(true);
	}

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

				<div id="div-log-grid">

					<div id="div-minutes">
						<div class="div-component-header">회의록</div>
						<div class="div-component" id="div-log-editor">
							<MDEditor.Markdown source={content} />
							<Modal
								size="lg"
								show={modalIsOpen}
								ariaHideApp={false}
								onHide={() => { setModalIsOpen(false); }}
							>
								<Modal.Header>
									<Modal.Title>
										회의록 수정
									</Modal.Title>
								</Modal.Header>
								<MDEditor
									value={content}
									preview="edit"
									onChange={(con) => setContent(con)}
								/>
								<br />
								<Button variant="primary" onClick={handleCloseOnClick}>
									완료하기
								</Button>{' '}

							</Modal>
						</div>
						<br />
						<Button variant="primary" onClick={handleOnClickModal}>
							수정하기
						</Button>{' '}
					</div>

					<div id="div-attendance">
						<div class="div-component-header">
							출석부
						</div>
						<div class="div-component">
							<MeetAttendance />
						</div>
					</div>

					<div id="div-assignment">
						<div class="div-component-header">
							과제함
						</div>
						<div class="div-component">

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

			</div> <hr />

		</div >
	);
}

export default StudyLog;
