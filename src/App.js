import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import {useState, useEffect} from 'react';

import Main from "./pages/Main";
import StudyMain from "./pages/StudyMain";

function App() {
  

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/study-group/:gpId" element={<StudyMain />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;