import { Link } from 'react-router-dom';
import './style/StudyList.css';

function StudyList({ gpId, groupName, groupDesc }) {
    return (
        <div>
            <h3>
                <Link to={`/study-group/${gpId}`}>{groupName}</Link>
            </h3>{groupDesc}
            <br/>
        </div>
    )
}

export default StudyList;