import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Food from "./Food";
import Activity from "./Activity";
import Travel from "./Travel";
import { codeAtom } from "atoms";
import { useRecoilValue } from "recoil";

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
  const navigate = useNavigate();
  const code = useRecoilValue(codeAtom);

  console.log(code);

  return (
    <Container>
      <div>
        <button onClick={() => navigate(-1)}>뒤로가기</button>
        <h1>질문 받는다</h1>
      </div>
      {category === "food" ? (
        <Food />
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
