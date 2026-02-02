import React from 'react';
import Navbar from './Navbar';
import About from './about';  
import Login from './Login';
import Signup from './Signup';
import { Routes, Route } from "react-router-dom";

export default function Header() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<div className="container mt-4"><h1>Home Page</h1></div>} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}