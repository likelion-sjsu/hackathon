import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  place-content: center;
  padding: 0 16px;
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  border-radius: 16px;
  height: 56px;
  letter-spacing: 1px;
  border: 1px solid #eeeeee;
  transition: 0.2s border-color;
  cursor: pointer;
`;

const TemperatureBox = styled.div`
  display: grid;
  place-content: center;
  width: calc(50% - 8px);
  height: 180px;
  border-radius: 16px;
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }
  label {
    display: grid;
    place-content: center;
    width: 72px;
    height: 72px;
    border-radius: 72px;
    border: 1px solid black;
    font-size: 40px;
  }
  h1 {
    font-size: 20px;
    font-weight: 600;
  }
`;

export default function OptionBox({ text, onClick, icon, selected }) {
  return icon ? (
    <TemperatureBox
      onClick={onClick}
      style={{
        backgroundColor:
          text === "Warm"
            ? "rgba(255, 196, 196, 0.32)"
            : "rgba(226, 249, 255, 0.6)",
        border: selected === true && "2px solid #836aad",
      }}
    >
      <div>
        <label
          style={{
            border: text === "Warm" ? "1px solid #FF9090" : "1px solid #9BE8FC",
          }}
        >
          {icon}
        </label>
        <h1>{text}</h1>
      </div>
    </TemperatureBox>
  ) : (
    <Container
      onClick={onClick}
      style={{
        border: selected === true && "2px solid #836aad",
      }}
    >
      {text}
    </Container>
  );
}
