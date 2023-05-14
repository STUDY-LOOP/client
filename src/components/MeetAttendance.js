import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

// table UI 
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { typography } from '@mui/system';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';


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
            <TableContainer sx={{ width: 400 }} component={Paper}>
                <Table stickyHeader="true">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ typography: 'body1', fontWeight: 'bold', textAlign: 'center' }}>이름</TableCell>
                            <TableCell sx={{ typography: 'body1', fontWeight: 'bold', textAlign: 'center' }}>출석 여부</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendance.map((row) => (
                            <TableRow
                                key={row['User.userNick']}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" sx={{ textAlign: 'center' }}>{row['User.userNick']}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{row.attendState}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default MeetAttendance;