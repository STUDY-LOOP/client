import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from 'axios';

import LayoutMain from '../components/LayoutMain';
import StudyList from '../components/StudyList';
import CreateStudyBtn from '../components/CreateStudyBtn';
import './style/Common.css'

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";

const SERVER_URI = 'http://localhost:3000';

function Main() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [studies, setStudies] = useState([]);
    const [user, setUser] = useState(sessionStorage.getItem("user_nick"));

    const callApi = async () => {
        const response = await axios.get(`${SERVER_URI}/api/study/all`);
        setStudies(response.data);
        setLoading(false);        
    };

    useEffect(() => {
        callApi();
    }, []);

    useEffect(() => {
        setUser(sessionStorage.getItem("user_nick"))
    }, [sessionStorage.getItem("user_nick")]);

    const onClickCreate = () => {
        navigate('/group/create');
    }

    return (
        <div class="div-layout-upper">
            <div class="div-layout-lower-1">
                <LayoutMain />
            </div>

            <div id="div-scroll-main" class="div-layout-lower-2">
                <div id="div-scroll-main-child">
                    <h1><b>스터디 준비부터 진행까지</b></h1>
                    <h4>새로운 스터디를 시작하세요!</h4>
                    <br /><br />

                    <div className="study-groups">
                        <h2><b>개설된 스터디</b></h2>
                        {loading ? <h3>LOADING...</h3> : studies.map(
                            study => (
                                <StudyList
                                    key={study.gpId}
                                    gpId={study.groupPublicId}
                                    groupName={study.groupName}
                                    groupDesc={study.groupDescription}
                                />
                            )
                        )}
                    </div> <br /><br />

                    {user
                        ? <div>
                            <Button onClick={onClickCreate}>스터디 만들기</Button>
                        </div>
                        : <>로그인 안 된 상태</>}

            </div>
        </div>
        </div >
    );
}

export default Main;