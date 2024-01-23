import { SERVER_URL } from "api";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
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

const CategoryBtn = styled.button`
  text-decoration: underline;
  color: blue;
  cursor: pointer;
`;

export default function SelectCategory() {
  const roomInfo = JSON.parse(localStorage.getItem("roomInfo"));
  const navigate = useNavigate();

  const onclick = async (category) => {
    console.log(category);

    if (roomInfo.role === "individual") {
      navigate(`${category}`);
    } else {
      const formData = new FormData();
      formData.append("category", category);
      const res = await fetch(`${SERVER_URL}/room/`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "roomInfo",
          JSON.stringify({
            role: "leader",
            code: data.code,
            category: category,
          })
        );
        navigate(`${category}`);
      }
    }
  };

  return (
    <Container>
      <Link to={"/mode"}>뒤로가기</Link>
      <CenterBox>
        <CategoryBtn onClick={() => onclick("food")}>음식</CategoryBtn>
        <CategoryBtn onClick={() => onclick("activity")}>액티비티</CategoryBtn>
        <CategoryBtn onClick={() => onclick("travel")}>여행</CategoryBtn>
      </CenterBox>
    </Container>
  );
}
