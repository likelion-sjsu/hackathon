import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.main`
  display: grid;
  place-content: center;
  width: 100vw;
  height: calc(100vh - 36px);
  gap: 20px;
`;

const CenterBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const CategoryBtn = styled(Link)`
  text-decoration: underline;
  color: blue;
  cursor: pointer;
`;

export default function SelectCategory() {
  const roomInfo = JSON.parse(localStorage.getItem("roomInfo"));

  console.log(roomInfo);

  return (
    <Container>
      <Link to={"/mode"}>뒤로가기</Link>
      <CenterBox>
        <CategoryBtn to={"./food"}>음식</CategoryBtn>
        <CategoryBtn to={"./activity"}>액티비티</CategoryBtn>
        <CategoryBtn to={"./travel"}>여행</CategoryBtn>
      </CenterBox>
    </Container>
  );
}
