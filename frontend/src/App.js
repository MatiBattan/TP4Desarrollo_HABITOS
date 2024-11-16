import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Estadisticas from './components/Estadisticas';
import Register from './components/Register';
import Historial from './components/Historial';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/estadisticas/:habitId" element={<Estadisticas />} />
          <Route path="/register" element={<Register />} />
          <Route path="/historial" element={<Historial />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
