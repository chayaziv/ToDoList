import React, { useEffect, useState } from "react";
import service from "./service.js";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes"; // מייבא את קובץ הנתיבים
console.log(process.env);
function App() {
  return (
    <Router>
      <AppRoutes />
      
    </Router>
  );
}

export default App;
