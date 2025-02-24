import React from "react";
import "./index.css";
import { UserProvider } from "./context/user.context";
import AppRoutes from "./routes/AppRoutes";
const App = () => {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
};

export default App;
