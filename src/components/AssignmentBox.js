import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Submitted from '../components/SubmittedAssignment';

const SERVER_URI = 'http://localhost:3000';

function AssignmentBox({ gpId, boxId, title, Assignments }) {
    const [file, setFile] = useState("");

    const onChange = (e) => {
        setFile(e.target.files[0]);
    };

    const upload = async (event) => {
        event.preventDefault();
        console.log("HIHI", gpId, boxId);

        /*
        axios.post(`${SERVER_URI}/api/assignment`, {
            gpId: gpId,
            boxId: boxId,
            uploader: '3@3',
            //fileData: event.target.file.files[0],
            fileData: event.target.fileData.value
        });
        */

        const formData = new FormData();
        formData.append('gpId', gpId);
        formData.append('boxId', boxId);
        formData.append('uploader', '3@3');
        formData.append('file', file);

        axios
            .post(`${SERVER_URI}/api/assignment`, formData)
            .then(res => {
                //const { fileName } = res.data;
                //console.log(fileName);
                //setUploadedImg({ fileName, filePath: `${BASE_URL}/img/${fileName}` });
                alert("The file is successfully uploaded");
            })
            .catch(err => {
                console.error(err);
            });
        //await uploadFile(formData);

    };

    return (
        <div>
            <strong>{title}</strong>
            {Assignments.map(
                (asgmt) =>
                    <Submitted
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