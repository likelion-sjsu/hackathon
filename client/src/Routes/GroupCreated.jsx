import React from "react";
import CreatedIcon from "../assets/Check-icon.svg";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.main`
  display: grid;
  place-content: center;
  width: 100vw;
  height: calc(100vh - 54px);

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

const CenterBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 360px;
  height: 550px;
  margin: 0 auto;
`;

const Code = styled.div`
  font-size: 48px;
  font-weight: 600;
  letter-spacing: 20px;
  margin-top: 40px;
`;

const Btn = styled.button`
  position: absolute;
  bottom: 0;
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
      <CenterBox>
        <img style={{ marginTop: 60 }} src={CreatedIcon} alt="" />
        <h1>Group Created</h1>
        <p>Share the number below</p>
        <p>with your friends</p>
        <Code>{code}</Code>
        <Btn onClick={() => navigate(`/category/${category}`)}>Open Poll</Btn>
      </CenterBox>
    </Container>
  );
}
