import { Dimensions, Image, Text, View } from "react-native";
import styled from "styled-components/native";
import { useRouter } from "expo-router";
import { Btn, BtnContainer, BtnText, Container } from "@/styles/GlobalStyle";

const PlaceholderImage = require("@/assets/images/illust.png");
const screenHeight = Dimensions.get("window").height;

const CenterBox = styled(View)`
  justify-content: center;
  align-items: center;
  width: 360px;
  height: ${screenHeight - 350}px;
`;

const HelpText = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.small};
  font-family: ${(props) => props.theme.fonts.medium};
  font-weight: 600;
  margin-top: 40px;
`;

export default function Index() {
  const { push } = useRouter();

  const handleStartBtn = () => {
    push("/solo");
  };

  return (
    <Container style={{ alignItems: "center" }}>
      <CenterBox>
        <Image source={PlaceholderImage} style={{ height: 260 }} />
        <HelpText>Let me help you decide!</HelpText>
      </CenterBox>
      <BtnContainer>
        <Btn onPress={handleStartBtn}>
          <BtnText>Get Started</BtnText>
        </Btn>
      </BtnContainer>
    </Container>
  );
}
