import PropTypes from "prop-types";
import { Link } from 'react-router-dom';

import PageLink from '../components/PageLink';

function StudyInfo({gpId, groupName, members}){
    return (
        <div>
            <h1>
                {groupName}
            </h1>

            <h3>
                스터디 멤버
                <ul>
                    {members.map((member) => <li key={member.userNick}>{member.userNick}</li>)}
                </ul>
            </h3>

            <div>
                <PageLink
                    link={`/study-group/${gpId}/member`}
                    title={'회원 관리'}
                /><br/>
                <PageLink
                    link={`/study-group/${gpId}/assignment`}
                    title={'과제함'}
                /><br/>
                <PageLink
                    link={`/study-group/${gpId}/videoChat`}
                    title={'화상회의'}
                />
            </div>
        </div>
    )
}

export default StudyInfo;