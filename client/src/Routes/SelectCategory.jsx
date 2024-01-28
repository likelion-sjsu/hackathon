import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { SERVER_URL } from "api";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import FoodIcon from "../assets/Food-icon.svg";
import TravelIcon from "../assets/Travel-icon.svg";
import HangoutIcon from "../assets/Hangout-icon.svg";

const Container = styled.main`
  display: grid;
  place-content: center;
  width: 100vw;
  height: calc(100vh - 36px);
`;

const CenterBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 360px;
  height: 548px;
`;

const Title = styled.div`
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 600;
  padding-left: 12px;
`;

const Subtitle = styled.div`
  font-size: ${(props) => props.theme.fontBigTitle.fontSize};
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

const Image = styled.img`
  margin-left: 24px;
  margin-right: 20px;
  width: 48px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function SelectCategory(props) {
  const roomInfo = JSON.parse(localStorage.getItem("roomInfo"));
  const navigate = useNavigate();
  const theme = useTheme();

  const onclick = async (category) => {
    console.log(category);

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

  return (
    <Container>
      <CenterBox>
        <Title>Categories</Title>
        <Subtitle>What can we help you to decide on?</Subtitle>
        <Box
          style={{ borderColor: theme.food }}
          onClick={() => onclick("food")}
        >
          <Image src={FoodIcon} alt="food" />
          <Content>
            <h1>Food</h1>
          </Content>
          <ChevronRightIcon />
        </Box>
        <Box
          style={{ borderColor: theme.hangout }}
          onClick={() => onclick("hangout")}
        >
          <Image src={HangoutIcon} alt="hangout" />
          <Content>
            <h1>Hangout</h1>
          </Content>
          <ChevronRightIcon />
        </Box>
        <Box
          style={{ borderColor: theme.travel }}
          // onClick={() => onclick("travel")}
        >
          <Image src={TravelIcon} alt="travel" />
          <Content>
            <h1>Travel</h1>
          </Content>
          <ChevronRightIcon />
        </Box>
      </CenterBox>
    </Container>
  );
}
