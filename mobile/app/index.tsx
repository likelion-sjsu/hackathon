import { Image, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { useRouter } from "expo-router";

const PlaceholderImage = require("@/assets/images/illust.png");

const Container = styled(View)`
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: calc(100vh - 36px);
`;

const CenterBox = styled(View)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 360px;
  height: 550px;
`;

const Desciption = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.small};
  font-family: ${(props) => props.theme.fonts.medium};
  font-weight: 600;
  margin-top: 40px;
  margin-bottom: 130px;
`;

const StartBtn = styled(TouchableOpacity)`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: ${(props) => props.theme.colors.light.primary};
  border: none;
  border-radius: 16px;
  cursor: pointer;
`;

const StartBtnText = styled(Text)`
  color: ${(props) => props.theme.colors.light.white};
  font-size: ${(props) => props.theme.fontSize.smaller};
  font-family: ${(props) => props.theme.fonts.medium};
`;

export default function Index() {
  const { push } = useRouter();
  const handleStartBtn = () => {
    push({ pathname: "/categories", params: { id: "solo" } });
  };

  return (
    <Container>
      <CenterBox>
        <Image source={PlaceholderImage} style={{ height: 260 }} />
        <Desciption>Let me help you decide!</Desciption>
        <StartBtn onPress={handleStartBtn}>
          <StartBtnText>Get Started</StartBtnText>
        </StartBtn>
      </CenterBox>
    </Container>
  );
}
