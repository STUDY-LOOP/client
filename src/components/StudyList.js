import PropTypes from "prop-types";
import { Link } from 'react-router-dom';

function StudyList({gpId, groupName}){
    return (
        <div>
            <h3>
                <Link to={`/study-group/${gpId}`}>{groupName}</Link>
            </h3>
        </div>
    )
}

export default StudyList;