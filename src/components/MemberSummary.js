import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';

import AssignmentResult from '../components/AssignmentResult';
import AssignmentName from '../components/AssignmentName';
import StudyNameRow from '../components/StudyNameRow';

import './style/AssignmentBox.css';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000'
    : 'http://localhost:3000';

function MemberSummary({ gpId, isAsgmt }) {
  const [loading, setLoading] = useState(true);
  const [studyInfo, setStudyInfo] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignment, setAssignment] = useState([]);

  useEffect(() => {
    axios
      .all([
        axios.get(`${SERVER_URI}/api/${gpId}/info`),
        axios.get(`${SERVER_URI}/api/attendance/${gpId}`),
        axios.get(`${SERVER_URI}/api/assignment/${gpId}`),
      ])
      .then(
        axios.spread((res1, res2, res3) => {
          setStudyInfo(res1.data);
          setAttendance(res2.data);
          setAssignment(res3.data);
          setLoading(false);

          console.log(res2.data);
          console.log(res3.data);
        })
      )
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {loading ? null : (
        <Table responsive bordered hover className="tables">
          <thead>
            <tr>
              <td>
                <b>이름</b>
              </td>
              {isAsgmt ? (
                <AssignmentName
                  key={studyInfo.groupPublicId}
                  gpId={studyInfo.groupPublicId}
                />
              ) : (
                <StudyNameRow
                  key={studyInfo.groupPublicId}
                  gpId={studyInfo.groupPublicId}
                />
              )}

              <td>
                <b>지각</b>
              </td>
              {isAsgmt ? (
                <td>
                  <b>미제출</b>
                </td>
              ) : (
                <td>
                  <b>결석</b>
                </td>
              )}
              <td>
                <b>총 벌금</b>
              </td>
            </tr>
          </thead>

          <tbody>
            {isAsgmt ? (
              <>
                {assignment &&
                  assignment.map((asgmt) => (
                    <>
                      <tr>
                        <td>{asgmt.nick}</td>
                        <AssignmentResult
                          summary={asgmt.summary[0]}
                          isAsgmt={true}
                        />
                        <td>
                          <b>{asgmt.asgmtLateCnt}회</b>
                        </td>
                        <td>
                          <b>{asgmt.asgmtAbsentCnt}회</b>
                        </td>
                        <td>
                          <b>{asgmt.asgmtLateFee + asgmt.asgmtAbsentFee}원</b>
                        </td>
                      </tr>
                    </>
                  ))}
              </>
            ) : (
              <>
                {attendance &&
                  attendance.map((attend) => (
                    <>
                      <tr>
                        <td>{attend.nick}</td>
                        <AssignmentResult
                          summary={attend.summary[0]}
                          isAsgmt={false}
                        />
                        <td>
                          <b>{attend.studyLateCnt}회</b>
                        </td>
                        <td>
                          <b>{attend.studyAbsentCnt}회</b>
                        </td>
                        <td>
                          <b>{attend.studyLateFee + attend.studyAbsentFee}원</b>
                        </td>
                      </tr>
                    </>
                  ))}
              </>
            )}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default MemberSummary;
