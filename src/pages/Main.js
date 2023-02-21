import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
//import { useDispatch } from 'react-redux';
import axios from 'axios';

import Layout from '../components/Layout';
import StudyList from '../components/StudyList';
import LoginForm from '../components/LoginForm';

function Main(){
    //const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [studies, setStudies] = useState([]);

    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const idRef = useRef();
    const pwRef = useRef();
    const navigate = useNavigate();


    const callApi = async() => {
        const response = await axios.get('http://localhost:3000/api/study/all');
        //console.log(response);
        //console.log(response.data);
        setStudies(response.data);
        setLoading(false);
    };

    useEffect(()=>{
        callApi();
    }, []);

    return (
        <div>
            {/* <LoginForm /> */}
            
            <Layout 
                //userNick={null}
                participatingCount={null}
                //email={null}
            />
            <hr/>

            <div className="study-groups">
                <h2>개설된 스터디</h2>
                {loading ? <h3>LOADING...</h3> : studies.map(
                    study => (
                        <StudyList
                            key={study.gpId}
                            gpId={study.groupPublicId}
                            groupName={study.groupName}
                        />
                    )
                )}
            </div>
            
            <br/><br/>
            
            
            <div>
                <form action="/study-group" method="get">
                    <button type="submit">스터디 만들기</button>
                </form>
            </div>
            
        </div>
    );
}

export default Main;