import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import FoodIcon from "../assets/Food-icon.svg";

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
`;

const Title = styled.div`
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 600;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 360px;
  height: 400px;
  margin-bottom: 24px;
  border: 1px solid ${(props) => props.theme.food};
  border-radius: 16px;
  box-shadow: 1px 2px 5px lightgray;

  img {
    height: 64px;
    margin-top: 78px;
  }

  h1 {
    margin-top: 50px;
    font-size: 48px;
    font-weight: 700;
  }
  p {
    margin-top: 50px;
  }
`;

const ToMapBtn = styled(Link)`
  display: grid;
  place-content: center;
  margin-top: 40px;
  width: 360px;
  min-height: 48px;
  border-radius: 16px;
  border: none;
  outline: none;
  background-color: ${(props) => props.theme.brandColor};
  font-size: ${(props) => props.theme.fontBtn.fontSize};
  font-weight: ${(props) => props.theme.fontBtn.fontWeight};
  color: white;
  cursor: pointer;
`;

const ToHomeBtn = styled(Link)`
  display: grid;
  place-content: center;
  margin-top: 24px;
  width: 360px;
  min-height: 48px;
  border-radius: 16px;
  border: none;
  outline: 1px solid #eeeeee;
  font-size: ${(props) => props.theme.fontBtn.fontSize};
  font-weight: ${(props) => props.theme.fontBtn.fontWeight};
  cursor: pointer;
`;

export default function Result() {
  const location = useLocation();
  const { result } = location.state;
  return (
    <Container>
      <CenterBox>
        <Title>Enjoy!</Title>
        <Box>
          <img src={FoodIcon} alt="food-icon" />
          <h1>{result}</h1>
          <p>Have a wonderful day!</p>
        </Box>
      </CenterBox>
      <ToMapBtn to={"/"}>Open in Google Maps</ToMapBtn>
      <ToHomeBtn to={"/"}>Go back to Home</ToHomeBtn>
    </Container>
  );
}
