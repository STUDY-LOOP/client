import PropTypes from "prop-types";

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
        </div>
    )
}

export default StudyInfo;