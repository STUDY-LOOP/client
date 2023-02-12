import { useEffect, useState } from "react";
//import { useDispatch } from 'react-redux';
import axios from 'axios';

import Layout from '../components/Layout';
import StudyList from '../components/StudyList';

function Main(){
    //const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [studies, setStudies] = useState([]);

    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const callApi = async() => {
        const response = await axios.get('http://localhost:3000/');
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
            <Layout 
                userNick={null}
                participatingCount={null}
                email={null}
            />
            <hr/>

            <div className="study-groups">
                <h2>개설된 스터디</h2>
                {loading ? <h3>LOADING...</h3> : studies.map(
                    study => (
                        <StudyList
                            key={study.groupId}
                            groupId={study.groupId}
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