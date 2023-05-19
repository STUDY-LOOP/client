import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import './style/LayoutStudyPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Offcanvas, Table } from 'react-bootstrap';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000'
    : 'http://localhost:3000';

function LayoutStudyPage({
  gpId,
  groupName,
  leader,
  rule,
  lateTime,
  lateFee,
  absentTime,
  absentFee,
  description,
}) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onClickTitle = () => {
    navigate(-1);
  };

  return (
    <div>
      <div id="header-studymain">
        <h1 onClick={onClickTitle}>
          <b>{groupName}</b>
        </h1>
        <p onClick={handleShow}>{description}</p>
      </div>

      <div id="offcanvas-rules">
        <Offcanvas show={show} onHide={handleClose} placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <h2>스터디 규칙</h2>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <p>
              <b>{rule}</b>
            </p>

            <div>
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th></th>
                    <th>시간</th>
                    <th>벌금</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>지각</b>
                    </td>
                    <td>{lateTime}</td>
                    <td>{lateFee}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>결석</b>
                    </td>
                    <td>{absentTime}</td>
                    <td>{absentFee}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
}

export default LayoutStudyPage;
