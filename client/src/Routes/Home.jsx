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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Desciption = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 130px;
`;

const StartBtn = styled(Link)`
  padding: 15px 130px;
  background-color: ${(props) => props.theme.brandColor};
  font-size: ${(props) => props.theme.fontBtn.fontSize};
  font-weight: ${(props) => props.theme.fontBtn.fontWeight};
  border-radius: 16px;
  color: white;
  transition: 0.2s all;
  cursor: pointer;

  &:hover {
    background-color: #6a45a8;
  }
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
