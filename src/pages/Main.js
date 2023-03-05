import { useEffect, useState } from "react";
import axios from 'axios';

import Layout from '../components/Layout';
import StudyList from '../components/StudyList';

const SERVER_URI = 'http://localhost:3000';

function Main() {
    const [loading, setLoading] = useState(true);
    const [studies, setStudies] = useState([]);

    const callApi = async () => {
        const response = await axios.get('http://localhost:3000/api/study/all');
        setStudies(response.data);
        setLoading(false);
    };

    useEffect(() => {
        callApi();
    }, []);

    return (
        <div>
            <Layout />
            <hr />

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

            <br /><br />


            <div>
                <form action="/study-group" method="get">
                    <button type="submit">스터디 만들기</button>
                </form>
            </div>

        </div>
    );
}

export default Main;