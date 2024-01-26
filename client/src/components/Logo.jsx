import React from "react";
import LogoSvg from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

export default function Logo() {
  const navigate = useNavigate();
  return (
    <img
      style={{ cursor: "pointer" }}
      onClick={() => navigate("/")}
      src={LogoSvg}
      alt="Logo"
    />
  );
}
