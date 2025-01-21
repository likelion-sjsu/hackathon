import React from "react";
import styled from "styled-components";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { useRecoilState } from "recoil";
import { modeAtom } from "@/utils/atoms";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Container } from "@/styles/GlobalStyle";

const CreatedIcon = require("../assets/images/Check-icon.png");

const CenterBox = styled(View)`
  justify-content: center;
  align-items: center;
  width: 360px;
  height: 550px;
  margin: 0 auto;
`;

const Title = styled(Text)`
  margin-top: 40px;
  font-size: ${(props) => props.theme.fontSize.large};
  font-family: ${(props) => props.theme.fonts.bold};
`;

const Subtitle = styled(Text)`
  margin-top: 10px;
  font-size: ${(props) => props.theme.fontSize.smaller};
  font-family: ${(props) => props.theme.fonts.medium};
  color: ${(props) => props.theme.colors.light.gray};
`;

const Code = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.larger};
  font-family: ${(props) => props.theme.fonts.bold};
  letter-spacing: 20px;
  margin-top: 40px;
`;

const Btn = styled(TouchableOpacity)`
  position: absolute;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.light.primary};
  border-radius: 16px;
  width: 360px;
  height: 48px;
`;

const BtnText = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.smaller};
  font-family: ${(props) => props.theme.fonts.bold};
  color: #fff;
`;

export default function GroupCreated() {
  const { push } = useRouter();
  const { cid } = useLocalSearchParams();
  const [{ code }, _] = useRecoilState(modeAtom);

  return (
    <Container>
      <CenterBox>
        <Image source={CreatedIcon} style={{ width: 120, height: 120 }} />
        <Title>Group Created</Title>
        <Subtitle>Share the number below</Subtitle>
        <Subtitle>to your friends</Subtitle>
        <Code>{code}</Code>
        <Btn onPress={() => push(`/category/${cid}`)}>
          <BtnText>Open Poll</BtnText>
        </Btn>
      </CenterBox>
    </Container>
  );
}
