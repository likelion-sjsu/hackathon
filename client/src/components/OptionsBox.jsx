import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 16px 10px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 16px;
  letter-spacing: 1px;
  border: 1px solid #eee;
  transition: 0.2s border-color;
  cursor: pointer;
`;

const IconBoxContainer = styled.div`
  display: grid;
  place-content: center;
  width: calc(50% - 8px);
  height: 180px;
  border-radius: 16px;
  cursor: pointer;
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
    background-color: white;
    border-radius: 72px;
    border: 1px solid black;
    font-size: 40px;
  }
  h1 {
    font-size: 20px;
    font-weight: 600;
  }
`;

const iconBoxColor = {
  background: {
    Warm: "rgba(255, 196, 196, 0.32)",
    Cold: "rgba(226, 249, 255, 0.32)",
    Indoor: "rgba(255, 230, 153, 0.32)",
    Outdoor: "rgba(212, 253, 213, 0.32)",
  },
  border: {
    Warm: "#FF9090",
    Cold: "#9BE8FC",
    Indoor: "#FFEB83",
    Outdoor: "#99CF9E",
  },
};

export default function OptionBox({
  keycode,
  option,
  onClick,
  selected,
  twoOptions,
}) {
  const text = option.value;
  const icon = option.icon;

  return twoOptions ? (
    option.index === 2 ? (
      <Container
        onClick={onClick}
        style={{
          outline: selected === true && "2px solid #836aad",
        }}
      >
        {icon} {text}
      </Container>
    ) : (
      <IconBoxContainer
        onClick={onClick}
        style={{
          backgroundColor: iconBoxColor.background[text],
          border: selected === true && "2px solid #836aad",
        }}
      >
        <div>
          <label
            style={{
              borderColor: iconBoxColor.border[text],
            }}
          >
            {icon}
          </label>
          <h1>{text}</h1>
        </div>
      </IconBoxContainer>
    )
  ) : (
    <Container
      onClick={onClick}
      style={{
        outline: selected === true && "2px solid #836aad",
      }}
    >
      {icon} {text}
    </Container>
  );
}
