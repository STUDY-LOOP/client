import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Submitted from '../components/SubmittedAssignment';

const SERVER_URI = 'http://localhost:3000';

function AssignmentBox({ gpId, boxId, title, Assignments }) {
    const [files, setFiles] = useState();

    const onChange = (event) => {
        setFiles(event.target.files[0]);
    };

    const upload = async(event) => {
        event.preventDefault();
        let jsonData = JSON.stringify({ 
            gpId: gpId,
            boxId: boxId,
            uploader: '3@3',
        });
        
        const formData = new FormData();
        formData.append('fileData', files);
        formData.append('jsonData', jsonData);
        
        await axios.post(`${SERVER_URI}/api/assignment`, formData);
    };

    return (
        <div>
            <strong>{title}</strong>
            {Assignments.map(
                (asgmt) =>
                    <Submitted
                        key={asgmt.filename}
                        gpId={gpId}
                        uploader={asgmt.uploader}
                        filename={asgmt.filename}
                        fileOrigin={asgmt.fileOrigin}
                        userNick={asgmt.User.userNick}
                    />
            )}

            <div>
                <form onSubmit={upload} encType="multipart/form-data">
                    <input type="file" name="fileData" onChange={onChange} />
                    <button type="submit">과제 제출</button>
                </form>
            </div>

            <br />
        </div>
    )
}

export default AssignmentBox;