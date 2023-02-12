import PropTypes from "prop-types";
import { Link } from 'react-router-dom';

function StudyList({groupId, groupName}){
    return (
        <div>
            <h3>
                <Link to={`/study-group/${groupName}=${groupId}`}>{groupName}</Link>
            </h3>
        </div>
    )
}

export default StudyList;