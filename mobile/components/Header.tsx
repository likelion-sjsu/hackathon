import { View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import Logo from "../assets/images/logo.svg";
import styled from "styled-components/native";

const Container = styled(View)`
  height: 120px;
  align-items: center;
  background-color: ${(props) => props.theme.colors.light.background};
  padding-top: 80px;
`;

export default function Header() {
  return (
    <Container>
      <Link href={"/"}>
        <Logo width={200} />
      </Link>
    </Container>
  );
}
