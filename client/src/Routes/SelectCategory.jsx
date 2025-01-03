import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { SERVER_URL } from "api";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { questionsByCategory } from "questions";

const Container = styled.main`
  display: grid;
  place-content: center;
  width: 100vw;
  height: calc(100vh - 54px);
`;

const CenterBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 360px;
  height: 550px;
`;

const Title = styled.div`
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 600;
  padding-left: 12px;
`;

const Subtitle = styled.div`
  font-size: 28px;
  font-weight: ${(props) => props.theme.fontBigTitle.fontWeight};
  padding-left: 12px;
  width: 280px;
  margin-bottom: 32px;
  line-height: 48px;
`;

const Box = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 360px;
  height: 90px;
  margin-bottom: 24px;
  border: 1px solid;
  border-radius: 16px;
  box-shadow: 1px 2px 5px lightgray;
  cursor: pointer;

  svg {
    position: absolute;
    right: 24px;
    height: 24px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
`;

export default function SelectCategory(props) {
  const roomInfo = JSON.parse(localStorage.getItem("roomInfo"));
  const navigate = useNavigate();

  const onclick = async (category) => {
    if (roomInfo.role === "individual") {
      localStorage.setItem(
        "roomInfo",
        JSON.stringify({
          ...roomInfo,
          category: category,
        })
      );
      navigate(`${category}`);
    } else {
      const formData = new FormData();
      const roomSize = JSON.parse(localStorage.getItem("roomInfo")).size;
      formData.append("category", category);
      formData.append("max_count", roomSize);
      const res = await fetch(`${SERVER_URL}/room/`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log(res.status, data);
      if (res.status === 201) {
        console.log(data);
        localStorage.setItem(
          "roomInfo",
          JSON.stringify({
            ...roomInfo,
            code: data.code,
            category: category,
          })
        );
        navigate("/created", { state: { category } });
      } else {
        alert("There is something wrong in server.");
        console.log(res);
      }
    }
  };
  console.log(questionsByCategory["travel"]);
  return (
    <Container>
      <CenterBox>
        <Title>Categories</Title>
        <Subtitle>What can we help you to decide on?</Subtitle>
        {questionsByCategory.map((category) => (
          <Box
            key={category.name}
            style={{ borderColor: category.theme }}
            onClick={() => onclick(category.name)}
          >
            <Content>
              <h1>
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </h1>
            </Content>
            <ChevronRightIcon />
          </Box>
        ))}
      </CenterBox>
    </Container>
  );
}
