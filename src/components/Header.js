import React from 'react';
import Navbar from './Navbar';
import Home from '../pages/Home';
import About from '../pages/about';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import { Routes, Route } from "react-router-dom";

export default function Header() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}