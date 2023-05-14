import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
	Button,
	Accordion,
	Table,
	Badge,
	Tooltip,
	OverlayTrigger,
	Form,
} from 'react-bootstrap';

import Submitted from '../components/SubmittedAssignment';
import './style/AssignmentBox.css';

const SERVER_URI = 'http://localhost:3000';

function MemberSummary({ gpId }) {
	const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.all([
            // axios.get(`${SERVER_URI}/api/${gpId}/info`),
            axios.get(`${SERVER_URI}/api/${gpId}/member`),
            axios.get(`${SERVER_URI}/api/${gpId}/event/calc`),
        ]).then(
            axios.spread((res1, res2) => {
                console.log(res1);
                console.log(res2);

                setLoading(false);
            })
        ).catch((err) => console.log(err));
    }, []);

	return (
		<>
        {gpId}
		</>
	);
}

export default MemberSummary;
