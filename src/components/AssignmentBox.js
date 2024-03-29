import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Button,
  Accordion,
  Table,
  Badge,
  Tooltip,
  OverlayTrigger,
  Form,
} from 'react-bootstrap';

import Submitted from '../components/SubmittedAssignment';
import './style/AssignmentBox.css';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000'
    : 'http://localhost:3000';

function AssignmentBox({
  gpId,
  boxId,
  title,
  Assignments,
  content,
  deadline,
  eventId,
}) {
  const [files, setFiles] = useState();
  const navigate = useNavigate();

  // 시간 계산
  const deadlineD = new Date(deadline);
  const nowD = new Date();
  const gap = nowD.getTime() - deadlineD.getTime();

  const onChange = (event) => {
    setFiles(event.target.files[0]);
  };

  const upload = async (event) => {
    console.log('upload 파트 실행');
    
    // event.preventDefault();
    let jsonData = JSON.stringify({
      gpId: gpId,
      boxId: boxId,
      uploader: sessionStorage.getItem('user_email'),
    });

    const formData = new FormData();
    formData.append('fileData', files);
    formData.append('jsonData', jsonData);

    await axios.post(`${SERVER_URI}/api/assignment`, formData);
    navigate(`/study-group/${gpId}/asgmt/${boxId}`);
  };

  return (
    <>
      <Accordion.Item eventKey={boxId}>
        <Accordion.Header id="accordion-header">
          <h4>
            <strong>{title}</strong>
          </h4>
          &nbsp;&nbsp;
          <OverlayTrigger
            key={deadline}
            placement="top"
            overlay={
              <Tooltip id={deadline}>
                마감시간 {deadlineD.getHours()}시 {deadlineD.getMinutes()}분
              </Tooltip>
            }
          >
            <h6>{deadline.substr(0, 10)}</h6>
          </OverlayTrigger>
        </Accordion.Header>

        <Accordion.Body>
          <h5>
            <strong>{content}</strong>
          </h5>
          {gap < 0 ? (
            <>
              <Badge pill bg="primary">
                제출 마감
              </Badge>{' '}
              {deadline.substr(0, 10)}. {deadlineD.getHours()}시{' '}
              {deadlineD.getMinutes()}분
            </>
          ) : (
            <>
              <Badge pill bg="secondary">
                제출 마감
              </Badge>{' '}
              {deadline.substr(0, 10)}. {deadlineD.getHours()}시{' '}
              {deadlineD.getMinutes()}분
            </>
          )}
        </Accordion.Body>

        <Accordion.Body>
          {Object.keys(Assignments).length !== 0 ? (
            <Table>
              <tr>
                <td>
                  <strong>과제</strong>
                </td>
                <td>
                  <strong>제출자</strong>
                </td>
                <td></td>
              </tr>
              {Assignments &&
                Assignments.map((asgmt) => (
                  <Submitted
                    key={asgmt.filename}
                    gpId={gpId}
                    uploader={asgmt.uploader}
                    filename={asgmt.filename}
                    fileOrigin={asgmt.fileOrigin}
                    submittedOn={asgmt.submittedOn}
                    userNick={asgmt.User.userNick}
                    deadline={deadline}
                  />
                ))}
            </Table>
          ) : (
            <div>제출된 과제 없음</div>
          )}
        </Accordion.Body>

        <Accordion.Body>
          <Form
            style={{ float: 'left', width: '78%' }}
            encType="multipart/form-data"
          >
            <Form.Control
              id="file-input"
              type="file"
              size="sm"
              name="fileData"
              onChange={onChange}
            />
          </Form>

          <Button
            variant="success"
            style={{ float: 'right', width: '20%' }}
            size="sm"
            onClick={upload}
          >
            과제 제출
          </Button>
        </Accordion.Body>

        <Accordion.Body> {/* 간격맞춤용 */} </Accordion.Body>
      </Accordion.Item>
    </>
  );
}

export default AssignmentBox;
