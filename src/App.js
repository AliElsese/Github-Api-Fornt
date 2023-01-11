import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Main Components
import Home from "./main-components/Home";
import LocalRepos from "./main-components/LocalRepos";
import Login from "./main-components/login-component/Login";
import Signup from "./main-components/signup-component/Signup";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="signup" element={<Signup />}></Route>
        <Route path="home/*" element={<Home />}></Route>
        <Route path="localRepos" element={<LocalRepos />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
