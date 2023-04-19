import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

// table UI 
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const SERVER_URI = 'http://localhost:3000';

function MeetAttendance() {
    const { log } = useParams()
    const [attendance, setAttendance] = useState([])

    const callApi = async () => {
        const res = await axios.get(`${SERVER_URI}/api/attendance/${log}`);
        setAttendance(res.data);
    };

    useEffect(() => {
        callApi();
    }, []);

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>이름</TableCell>
                            <TableCell>출석 여부</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendance.map((row) => (
                            <TableRow
                                key={row.userNick}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{row.userNick}</TableCell>
                                <TableCell>{row.attendState}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default MeetAttendance;