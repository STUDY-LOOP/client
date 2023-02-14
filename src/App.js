import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import {useState, useEffect} from 'react';

import Main from "./pages/Main";
import StudyMain from "./pages/StudyMain";
import CreateGroup from "./pages/CreateGroup";
import StudyMember from "./pages/StudyMember";
import StudyAssignment from "./pages/StudyAssignment";

function App() {
  

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/study-group" element={<CreateGroup />} />
            <Route path="/study-group/:gpId" element={<StudyMain />} />
            <Route path="/study-group/:gpId/member" element={<StudyMember />} />
            <Route path="/study-group/:gpId/assignment" element={<StudyAssignment />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;