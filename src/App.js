import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import {useState, useEffect} from 'react';

import Main from "./pages/Main";
import Join from "./pages/Join";
import MyPage from "./pages/MyPage";
import StudyMain from "./pages/StudyMain";
import CreateGroup from "./pages/CreateGroup";
import StudyMember from "./pages/StudyMember";
import StudyAssignment from "./pages/StudyAssignment";
import CalendarAssignment from "./pages/CalendarAssignment";
import StudyLog from "./pages/StudyLog";
import VideoChat from './pages/VideoChat';

function App() {
  
  axios.defaults.withCredentials = true; 

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/join" element={<Join />} />
            <Route path="/my/profile" element={<MyPage />} />
            <Route path="/study-group" element={<CreateGroup />} />
            <Route path="/study-group/:gpId" element={<StudyMain />} />
            <Route path="/study-group/:gpId/member" element={<StudyMember />} />
            <Route path="/study-group/:gpId/assignment" element={<StudyAssignment />} />
            <Route path="/study-group/:gpId/:boxId" element={<CalendarAssignment />} />
            <Route path="/study-group/:gpId/log/:log" element={<StudyLog />} />
            <Route path="/study-group/:gpId/videoChat" element={<VideoChat />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;