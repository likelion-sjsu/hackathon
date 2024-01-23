import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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
  gap: 20px;
`;

const Welcome = styled.div``;

const Desciption = styled.div``;

const StartBtn = styled(Link)`
  text-decoration: underline;
  color: blue;
  cursor: pointer;
`;

export default function Home() {
  return (
    <Container>
      <CenterBox>
        <Welcome>환영</Welcome>
        <Desciption>설명문구</Desciption>
        <StartBtn to={"/mode"}>시작하기 버튼</StartBtn>
      </CenterBox>
    </Container>
  );
}
