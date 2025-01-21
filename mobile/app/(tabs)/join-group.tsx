import {
  Btn,
  BtnContainer,
  BtnPlaceHolder,
  BtnPlaceHolderText,
  BtnText,
  Container,
  Subtitle,
  Title,
} from "@/styles/GlobalStyle";
import { SERVER_URL } from "@/utils/api";
import { modeAtom } from "@/utils/atoms";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput } from "react-native";
import { useRecoilState } from "recoil";

import styled from "styled-components";

const DigitContainer = styled(TextInput)`
  margin-top: 40px;
  font-size: ${(props) => props.theme.fontSize.small};
  font-family: ${(props) => props.theme.fonts.medium};
  width: 100px;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 0 15px;
  text-align: center;
  letter-spacing: 2px;
`;

export default function JoinGroup() {
  const { push } = useRouter();
  const [code, setCode] = useState("");
  const [mode, setMode] = useRecoilState(modeAtom);
  const [category, setCategory] = useState("");

  const onClickNext = async () => {
    console.log(code);
    // verify
    const res = await fetch(`${SERVER_URL}/room/${code}`);
    const { category, outcome, answered_count, max_count } = await res.json();
    if (res.ok) {
      if (outcome !== "") {
        alert("The group no longer exists");
        return;
      }
      if (answered_count === max_count) {
        alert("The group is already full.");
        return;
      }
      setMode({ role: 1, size: max_count, code });
      push(`/category/${category}`);
    } else if (res.status === 404) {
      alert("Group not found. Please try a different code.");
    } else {
      alert("Something wrong in the server.");
    }
    setCode("");
  };

  return (
    <Container style={{ alignItems: "center" }}>
      <Title style={{ marginTop: 20 }}>Verify Your Code</Title>
      <Subtitle style={{ marginTop: 20 }}>Enter 4-digit code</Subtitle>
      <DigitContainer keyboardType="number-pad" maxLength={4} value={code} onChangeText={setCode} placeholder="CODE" />

      <BtnContainer>
        {code.length === 4 ? (
          <Btn onPress={onClickNext}>
            <BtnText>Next</BtnText>
          </Btn>
        ) : (
          <BtnPlaceHolder>
            <BtnPlaceHolderText>Next</BtnPlaceHolderText>
          </BtnPlaceHolder>
        )}
      </BtnContainer>
    </Container>
  );
}
