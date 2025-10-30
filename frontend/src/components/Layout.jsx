import React from "react";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <>
      <main className="main">{children}</main>
    </>
  );
};

export default Layout;