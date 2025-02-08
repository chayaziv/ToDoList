import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Todos from "./pages/Todos";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="todos" element={<Todos />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
