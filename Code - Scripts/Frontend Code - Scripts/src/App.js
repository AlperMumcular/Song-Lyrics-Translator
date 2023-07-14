import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminControlPage from "./AdminControlPage";
import Home from "./Home";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<LoginForm />} />
      <Route path="/home" element={<AdminControlPage />}/>
    </Routes>
      </Router>
    </div>
  );
}

export default App;