import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import image from "../assets/illust.png";

const Container = styled.main`
  display: grid;
  place-content: center;
  width: 100vw;
  height: calc(100vh - 36px);
`;

const CenterBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 360px;
  height: 550px;
`;

const Desciption = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 130px;
`;

const StartBtn = styled(Link)`
  display: grid;
  place-content: center;
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 48px;
  background-color: ${(props) => props.theme.brandColor};
  color: white;
  border: none;
  border-radius: 16px;
  outline: none;
  font-size: ${(props) => props.theme.fontBtn.fontSize};
  font-weight: ${(props) => props.theme.fontBtn.fontWeight};
  cursor: pointer;
`;

export default function Home() {
  return (
    <Container>
      <CenterBox>
        <img src={image} alt="." style={{ marginBottom: "40px" }} />
        <Desciption>Let me help you decide!</Desciption>
        <StartBtn to={"/mode"}>Get Started</StartBtn>
      </CenterBox>
    </Container>
  );
}
