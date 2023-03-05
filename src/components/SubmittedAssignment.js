import axios from 'axios';

const SERVER_URI = 'http://localhost:3000';

function SubmittedAssignment({ gpId, uploader, filename, fileOrigin, userNick }) {
    const onClick = () => {
        //event.preventDefault();
        axios.delete(`${SERVER_URI}/api/assignment`, {
            data: {
                filename: filename,
                gpId: gpId,
            }
        });
        
        window.location.reload();
    };

    return (
        <div>
            <a href={`${SERVER_URI}/api/download/${filename}`} download>{fileOrigin}</a> (제출자: {userNick})
            <button onClick={onClick}>삭제</button>
        </div>
    )
}

export default SubmittedAssignment;