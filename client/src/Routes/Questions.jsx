import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Food from "./Food";
import Activity from "./Activity";
import Travel from "./Travel";

const Container = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100vw;
  padding: 20px;
  height: calc(100vh - 36px);
`;

export default function Questions() {
  const { category } = useParams();
  const roomInfo = JSON.parse(localStorage.getItem("roomInfo"));

  console.log(roomInfo);

  return (
    <Container>
      {roomInfo.role === "leader" && <div>코드는 {roomInfo.code}야</div>}
      <div>
        <h1>질문 받는다</h1>
      </div>
      {category === "food" ? (
        <Food roomInfo={roomInfo} />
      ) : category === "activity" ? (
        <Activity />
      ) : category === "travel" ? (
        <Travel />
      ) : (
        <div>해당 카테고리가 존재하지 않습니다.</div>
      )}
    </Container>
  );
}
