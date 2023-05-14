import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Badge, Button, Table } from "react-bootstrap";

import UserAssignment from '../components/UserAssignment';
import AssignmentName from '../components/AssignmentName';
import MemberWithQuitBtn from '../components/MemberWithQuitBtn';
import LayoutStudyPage from '../components/LayoutStudyPage';
import MemberAttendance from "../components/MemberAttendance.js";
import LayoutMain from '../components/LayoutMain';
import MemberSummary from '../components/MemberSummary';
import './style/StudyMember.css';
import './style/Common.css';

const SERVER_URI = 'http://localhost:3000';

function StudyMember() {

    const { gpId } = useParams();
    const [loading, setLoading] = useState(true);

    const [studyInfo, setStudyInfo] = useState([]);
    const [studyMembers, setStudyMembers] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [studyLeader, setStudyLeader] = useState(null);

    useEffect(() => {
        axios.all([
            axios.get(`${SERVER_URI}/api/${gpId}/info`),
            axios.get(`${SERVER_URI}/api/${gpId}/member`),
            axios.get(`${SERVER_URI}/api/${gpId}/assignment`),
        ]).then(
            axios.spread((res1, res2, res3) => {
                setStudyInfo(res1.data);
                setStudyLeader(res1.data.User.userNick)
                setStudyMembers(res2.data);
                setAssignments(res3.data);
                setLoading(false);
            })
        ).catch((err) => console.log(err));
    }, []);

    return (
        <div class="div-layout-upper">
            <div class="div-layout-lower-1">
                <LayoutMain />
            </div>
            {/* <div class="div-layout-lower-2"> */}
            <div class="div-layout-lower-2-custom">
                <div id="div-grid-members">
                    <div id="div-layout">
                        <LayoutStudyPage
                            key={studyInfo.groupPublicId}
                            gpId={studyInfo.groupPublicId}
                            groupName={studyInfo.groupName}
                            leader={studyInfo.leader}
                        />
                    </div>
                    <div id="div-members">
                        // 이 부분이 필요해 보이나요? 스터디장 말고 스터디원 목록 <br /><br />
                        [스터디장] {studyInfo.groupLeader} <br /><br />

                        <div>
                            [스터디원]

                            {studyMembers.map((member) =>
                                <MemberWithQuitBtn
                                    key={member.email}
                                    email={member.email}
                                    nick={member.userNick}
                                    gpId={studyInfo.groupPublicId}
                                    leader={studyInfo.groupLeader}
                                />
                            )}
                        </div>
                    </div>

                    <div id="div-table-asgmt">
                        <Alert variant="primary">
                            <p>과제</p>
                        </Alert>
                        {loading ? <h3>LOADING...</h3> :
                            <Table responsive bordered hover className="tables">
                                <thead>
                                    <tr>
                                        <td width="50"></td>
                                        <AssignmentName
                                            key={studyInfo.groupPublicId}
                                            gpId={studyInfo.groupPublicId}
                                        />
                                        <td width="70"><b>미제출</b></td>

                                    </tr>
                                </thead>

                                <tbody>
                                    <UserAssignment
                                        key={studyInfo.groupLeader}
                                        email={studyInfo.groupLeader}
                                        nick={studyLeader}
                                        gpId={studyInfo.groupPublicId}
                                    />

                                    {studyMembers.map(
                                        (member) =>
                                            <UserAssignment
                                                key={member.email}
                                                email={member.email}
                                                nick={member.userNick}
                                                gpId={studyInfo.groupPublicId}
                                            />
                                    )}
                                </tbody>
                            </Table>
                        }
                    </div>

                    <div id="div-table-attend">
                        <h2><Badge pill bg="primary">출석</Badge></h2>
                        {loading ? <h3>LOADING...</h3> :
                            <MemberAttendance

                            />

                            // <Table responsive bordered hover className="tables" id="HIHI">
                            //     <thead>
                            //         <tr>
                            //             <td></td>
                            //             <AssignmentName
                            //                 key={studyInfo.groupPublicId}
                            //                 gpId={studyInfo.groupPublicId}
                            //             />
                            //             <td><b>미제출</b></td>
                            //             <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>dd</td>
                            //         </tr>
                            //     </thead>

                            //     <tbody>
                            //         <UserAssignment
                            //             key={studyInfo.groupLeader}
                            //             email={studyInfo.groupLeader}
                            //             nick={studyLeader}
                            //             gpId={studyInfo.groupPublicId}
                            //         />

                            //         {studyMembers.map(
                            //             (member) =>
                            //                 <UserAssignment
                            //                     key={member.email}
                            //                     email={member.email}
                            //                     nick={member.userNick}
                            //                     gpId={studyInfo.groupPublicId}
                            //                 />
                            //         )}
                            //     </tbody>
                            // </Table>
                        }
                    </div>

                    <div id="div-table-fee">
                        <MemberSummary
                            gpId={gpId}
                        />
                    </div>
                </div>
            </div>
            {/* </div> */}
        </div>
    );
}

export default StudyMember;