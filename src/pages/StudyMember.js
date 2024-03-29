import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Badge, Button, Table } from 'react-bootstrap';

import LayoutStudyPage from '../components/LayoutStudyPage';
import LayoutMain from '../components/LayoutMain';
import MemberSummary from '../components/MemberSummary';
import './style/StudyMember.css';
import './style/Common.css';

const SERVER_URI =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.202.121:3000'
    : 'http://localhost:3000';

function StudyMember() {
  const { gpId } = useParams();
  const [loading, setLoading] = useState(true);

  const [studyInfo, setStudyInfo] = useState([]);
  const [studyMembers, setStudyMembers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [studyLeader, setStudyLeader] = useState(null);

  useEffect(() => {
    axios
      .all([
        axios.get(`${SERVER_URI}/api/${gpId}/info`),
        axios.get(`${SERVER_URI}/api/${gpId}/member`),
        axios.get(`${SERVER_URI}/api/${gpId}/assignment`),
      ])
      .then(
        axios.spread((res1, res2, res3) => {
          setStudyInfo(res1.data);
          setStudyLeader(res1.data.User.userNick);
          setStudyMembers(res2.data);
          setAssignments(res3.data);
          setLoading(false);
        })
      )
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="div-layout-upper">
      <div className="div-layout-lower-1">
        <LayoutMain />
      </div>

      <div className="div-layout-lower-2-custom">
        <div id="div-layout" class="colored-layout-div">
          <LayoutStudyPage
            key={studyInfo.groupPublicId}
            gpId={studyInfo.groupPublicId}
            groupName={studyInfo.groupName}
            leader={studyInfo.leader}
          />
        </div>

        <div id="div-grid-members">
          <div id="div-members">
            <div id="div-leader">
              <div class="div-component-header"> 스터디장 </div>
              <div id="div-leader-nick"> {studyLeader} </div>
            </div>
          </div>

          <div id="div-table-attend">
            <h2>
              <Badge pill bg="primary">
                출석
              </Badge>
            </h2>
            {loading ? (
              // <h3>LOADING...</h3>
              <Button variant="secondary" onClick={() => window.location.reload()} size="sm">새로고침</Button>
            ) : (
              <MemberSummary key={gpId} gpId={gpId} isAsgmt={false} />
            )}
          </div>

          <div id="div-table-asgmt">
            <h2>
              <Badge pill bg="primary">
                과제
              </Badge>
            </h2>
            {loading ? (
              <Button variant="secondary" onClick={() => window.location.reload()} size="sm">새로고침</Button>
            ) : (
              <MemberSummary key={gpId} gpId={gpId} isAsgmt={true} />
            )}
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}

export default StudyMember;
