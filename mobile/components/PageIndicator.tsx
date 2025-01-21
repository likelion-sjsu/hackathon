import React from "react";
import styled from "styled-components/native";
import { View, Animated } from "react-native";

const Container = styled(View)`
  flex-direction: row;
  gap: 10px;
`;

const Bar = styled(Animated.View)`
  width: 40px;
  height: 8px;
  background-color: ${(props) => props.theme.colors.light.primary};
  border-radius: 4px;
`;

const Dot = styled(View)`
  width: 8px;
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
`;

export default function PageIndicator({ total, current }) {
  return (
    <Container>
      {Array.from({ length: total }).map((_, index) => (index === current ? <Bar key={index} /> : <Dot key={index} />))}
    </Container>
  );
}
