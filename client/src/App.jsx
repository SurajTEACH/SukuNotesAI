import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import { getCurrentUser } from "./services/api.js";
import { useDispatch, useSelector } from "react-redux";
import Notes from "./pages/Notes.jsx";
import History from "./pages/NotesHistory.jsx";
import Pricing from "./pages/pricing.jsx";
import NotesPage from "./pages/NotesPage.jsx";
import Interview from "./pages/interview.jsx";
import InterviewPage from "./pages/interviewPage.jsx";
import InterviewHistory from "./pages/interviewHistory.jsx";
import InterviewReport from "./pages/InterviewReport.jsx";

export const serverUrl = "https://sukunotesai.onrender.com";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser(dispatch);
  }, [dispatch]);

  const { userData } = useSelector((state) => state.user);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/auth"
          element={userData ? <Navigate to="/" replace /> : <Auth />}
        />

        <Route
          path="/notes"
          element={userData ? <Notes /> : <Navigate to="/auth" replace />}
        />

        
        <Route
          path="/history"
          element={userData ? <History />: <Navigate to="/auth" replace />}
        />
        
        
        <Route
          path="/pricing"
          element={userData ? <Pricing /> : <Navigate to="/auth" replace />}
        />
        
        
        <Route
          path="/notes-page"
          element={userData ? <NotesPage /> : <Navigate to="/auth" replace />}
        />
        
        <Route
          path="/mock-interview"
          element={userData ? <Interview /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/interview-page"
          element={userData ? <InterviewPage /> : <Navigate to="/auth" replace />}
        />
        
         <Route
          path="/interview-history"
          element={userData ? <InterviewHistory /> : <Navigate to="/auth" replace />}
        />
        
        <Route
          path="/interview-report/:id"
          element={userData ? <InterviewReport /> : <Navigate to="/auth" replace />}
        />

      </Routes>
    </>
  );
}

export default App;
