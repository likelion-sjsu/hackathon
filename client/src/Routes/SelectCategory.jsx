import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { SERVER_URL } from "api";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import FoodIcon from "../assets/food.png";
import TravelIcon from "../assets/travel.png";
import HangoutIcon from "../assets/hangout.png";
import Logo from "components/Logo";

const Container = styled.main`
  display: grid;
  place-content: center;
  width: 100vw;
  height: calc(100vh - 36px);
`;

const Header = styled.div`
  position: absolute;
  top: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  h1 {
    font-size: 17px;
    font-weight: 600;
  }

  a {
    position: absolute;
    left: 40px;
    svg {
      height: 24px;
    }
  }
`;

const CenterBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const Title = styled.div`
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 600;
`;

const Box = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 360px;
  height: 140px;
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
const Image = styled.div`
  margin-left: 24px;
  margin-right: 20px;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;

  h1 {
    margin-bottom: 16px;
  }
`;

export default function SelectCategory(props) {
  const roomInfo = JSON.parse(localStorage.getItem("roomInfo"));
  const navigate = useNavigate();
  const theme = useTheme();

  const onclick = async (category) => {
    console.log(category);

    if (roomInfo.role === "individual") {
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
            role: "leader",
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
      <Header>
        <Link to={"/mode"}>
          <ChevronLeftIcon />
        </Link>
        <Logo />
      </Header>
      <CenterBox>
        <Title>Categories</Title>
        <Box
          style={{ borderColor: theme.food }}
          onClick={() => onclick("food")}
        >
          <Image>
            <img src={FoodIcon} alt="food" />
          </Image>
          <Content>
            <h1>Food</h1>
            <p>Let's go somewhere fun!</p>
          </Content>
          <ChevronRightIcon />
        </Box>
        <Box
          style={{ borderColor: theme.hangout }}
          onClick={() => onclick("hangout")}
        >
          <Image>
            <img src={HangoutIcon} alt="hangout" />
          </Image>
          <Content>
            <h1>Hangout</h1>
            <p>Let's go somewhere fun!</p>
          </Content>
          <ChevronRightIcon />
        </Box>
        <Box
          style={{ borderColor: theme.travel }}
          onClick={() => onclick("travel")}
        >
          <Image>
            <img src={TravelIcon} alt="travel" />
          </Image>
          <Content>
            <h1>Travel</h1>
            <p>Let's go somewhere fun!</p>
          </Content>
          <ChevronRightIcon />
        </Box>
      </CenterBox>
    </Container>
  );
}
