import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { useRecoilState } from "recoil";
import { modeAtom } from "@/utils/atoms";
import styled from "styled-components";
import { Btn, Container, Subtitle, Title } from "@/styles/GlobalStyle";

const CenterBox = styled(View)`
  flex-direction: column;
  justify-content: flex-start;
  width: 360px;
`;

const Box = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 150px;
`;

const Circle = styled(View)`
  justify-content: center;
  align-items: center;
  width: 144px;
  height: 144px;
  border: 3px solid #7e518e;
  border-radius: 144px;
`;

const Number = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.larger};
  font-family: ${(props) => props.theme.fonts.bold};
`;

const BtnText = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.smaller};
  font-family: ${(props) => props.theme.fonts.bold};
  color: #fff;
`;

export default function AddGroup() {
  const { push } = useRouter();
  const [num, setNum] = useState(2);
  const [_, setMode] = useRecoilState(modeAtom);

  const onClickCreateRoom = () => {
    setMode({ role: 0, size: num, code: "" });
    push("/category");
  };

  return (
    <Container>
      <CenterBox>
        <Title>Create a Group</Title>
        <Subtitle>How many people are in your group?</Subtitle>
        <Box>
          <Ionicons name="remove" onPress={() => num > 2 && setNum((prev) => prev - 1)} size={40} />
          <Circle>
            <Number>{num}</Number>
          </Circle>
          <Ionicons name="add" onPress={() => num < 20 && setNum((prev) => prev + 1)} size={40} />
        </Box>
        <Btn style={{ marginTop: 80 }} onPress={onClickCreateRoom}>
          <BtnText>Next</BtnText>
        </Btn>
      </CenterBox>
    </Container>
  );
}
