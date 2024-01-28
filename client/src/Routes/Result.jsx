import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import FoodIcon from "../assets/Food-icon.svg";
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
`;

const Title = styled.div`
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 600;
  padding-left: 12px;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 60px;
  width: 360px;
  height: 400px;
  margin-bottom: 24px;
  border: 1px solid;
  border-radius: 16px;
  box-shadow: 1px 2px 5px lightgray;

  img {
    height: 64px;
  }

  h1 {
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
    width: 340px;
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

const price_query = {
  whatever: "",
  "$0-$10": "1e0!",
  "$10-$25": "1e1!",
  "$25-$50": "1e2!",
  "$50 and up": "1e3!",
};

export default function Result() {
  const location = useLocation();
  const { result, query } = location.state;
  const [fontSize, setFontSize] = useState(48);
  const boxRef = useRef(null);
  const { category } = JSON.parse(localStorage.getItem("roomInfo"));
  const theme = useTheme();

  useEffect(() => {
    const adjustFontSize = () => {
      const box = boxRef.current;
      if (!box) return;

      const boxWidth = box.clientWidth - 40;
      const textWidth = box.scrollWidth;

      const scaleFactor = boxWidth / textWidth;
      const newFontSize = Math.floor(fontSize * scaleFactor);

      setFontSize(newFontSize);
    };

    // Adjust font size on initial render
    adjustFontSize();

    // Attach resize event listener
    window.addEventListener("resize", adjustFontSize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", adjustFontSize);
    };
  }, [result]); // Only re-run the effect if fontSize changes

  const url = `https://www.google.com/maps/search/${result
    .replace(/ /g, "+")
    .replace(".", "")}+near+me/data=!3m1!4b1!4m4!2m3!5m1!${
    price_query[query.price]
  }6e5?entry=ttu`;

  return (
    <Container>
      <CenterBox>
        <Title>Enjoy!</Title>
        <Box ref={boxRef} style={{ borderColor: theme[category] }}>
          <img
            src={category === "food" ? FoodIcon : HangoutIcon}
            alt="food-icon"
          />
          <h1
            style={{
              fontFamily: "'Fugaz One', sans-serif",
              fontSize: fontSize,
            }}
          >
            {result.replace(".", "")}
          </h1>
          <p>Have a wonderful day!</p>
        </Box>
      </CenterBox>
      <ToMapBtn to={url} target="_blank" rel="noopener noreferrer">
        Open in Google Maps
      </ToMapBtn>
      <ToHomeBtn to={"/"}>Go back to Home</ToHomeBtn>
    </Container>
  );
}
