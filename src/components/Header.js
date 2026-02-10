import React from 'react';
import Navbar from './Navbar';
import About from '../pages/about';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Home from '../pages/Home';
import Welcome from '../pages/Welcome';
import { Routes, Route, Navigate } from "react-router-dom";

export default function Header() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}