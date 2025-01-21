import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components";

const Container = styled(TouchableOpacity)`
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 16px;
  letter-spacing: 5px;
  border: 1px solid #eee;
  transition: 0.2s border-color border-width;
  cursor: pointer;
  height: 50px;
`;

const IconBoxContainer = styled(View)`
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

const OptionText = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.smaller};
`;

export default function Option({ option, onClick, selected }) {
  const text = option.value;
  const icon = option.icon;

  return (
    <Container
      onPress={onClick}
      style={{
        borderColor: selected ? "#836aad" : "#eee",
        borderWidth: selected ? 2 : 1,
        paddingHorizontal: selected ? 9 : 10,
      }}
    >
      <OptionText>
        {icon} {text}
      </OptionText>
    </Container>
  );
}
