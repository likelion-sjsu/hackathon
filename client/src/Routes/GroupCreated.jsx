import React from "react";
import CreatedIcon from "../assets/Check-icon.svg";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: calc(100vh - 36px);

  h1 {
    margin-top: 40px;
    margin-bottom: 10px;
  }
  p {
    margin-top: 10px;
    color: ${(props) => props.theme.secondaryFont};
    font-weight: 500;
  }
`;

const Code = styled.div`
  font-size: 48px;
  font-weight: 600;
  letter-spacing: 20px;
  margin-top: 40px;
`;

const Btn = styled.button`
  margin-top: 60px;
  background-color: ${(props) => props.theme.brandColor};
  font-size: ${(props) => props.theme.fontBtn.fontSize};
  font-weight: ${(props) => props.theme.fontBtn.fontWeight};
  color: white;
  border-radius: 16px;
  border: none;
  outline: none;
  width: 360px;
  height: 48px;
`;

export default function GroupCreated() {
  const navigate = useNavigate();
  const { code, category } = JSON.parse(localStorage["roomInfo"]);

  return (
    <Container>
      <img style={{ marginTop: 60 }} src={CreatedIcon} alt="" />
      <h1>Group Created</h1>
      <p>Share the number above</p>
      <p>with your friends</p>
      <Code>{code}</Code>
      <Btn onClick={() => navigate(`/category/${category}`)}>Next</Btn>
    </Container>
  );
}
