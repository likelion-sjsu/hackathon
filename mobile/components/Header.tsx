import { View, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import Logo from "../assets/images/logo.svg";
import styled from "styled-components/native";

const Container = styled(View)`
  height: 100px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.light.background};
`;

export default function Header() {
  const navigation = useNavigation();

  const handleLogoPress = () => {
    navigation.navigate("index");
  };

  return (
    <Container>
      <TouchableOpacity onPress={handleLogoPress}>
        <Logo width={200} />
      </TouchableOpacity>
    </Container>
  );
}
