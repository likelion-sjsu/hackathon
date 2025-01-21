import {
  Btn,
  BtnContainer,
  BtnPlaceHolder,
  BtnPlaceHolderText,
  BtnText,
  CodeText,
  Container,
  Title,
} from "@/styles/GlobalStyle";
import { TextInput, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import Loader from "@/components/Loader";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { modeAtom } from "@/utils/atoms";
import { SERVER_URL } from "@/utils/api";
import { useRouter } from "expo-router";

const Form = styled(View)`
  flex: 1;
  width: 360px;
  align-items: center;
  margin-top: 30px;
`;

const TextArea = styled(TextInput).attrs({
  multiline: true,
  numberOfLines: 4,
})`
  width: 100%;
  height: 200px;
  padding: 24px;
  margin-top: 40px;
  background-color: #f4f4f4;
  border-radius: 16px;
  font-family: ${(props) => props.theme.fonts.medium};
  font-size: ${(props) => props.theme.fontSize.small};
`;

export default function SpecialRequest({ category, answers }) {
  const [isFetching, setIsFetching] = useState(false);
  const [mode, _] = useRecoilState(modeAtom);
  const { push } = useRouter();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      special_request: "",
    },
  });

  const onSubmit = async ({ special_request }) => {
    console.log(setIsFetching);
    if (isFetching === true) return;
    const formData = [...answers, ["special offer", [{ value: special_request }]]];
    setIsFetching(true);

    /* Solo */
    if (mode.size === 1) {
      const res = await fetch(`${SERVER_URL}/recommend/${category}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      push({
        pathname: "/result",
        params: { data: JSON.stringify(data) },
      });
    } else if (mode.size > 1) {
      /* Group */
      if (mode.size > 1) {
        await fetch(`${SERVER_URL}/recommend?code=${mode.code}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        push({ pathname: `/standby`, params: { data: JSON.stringify(answers) } });
      }
    }
    setIsFetching(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Form>
          <Title>Any special requests we need know?</Title>
          <Controller
            name="special_request"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextArea
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder="ex) I am a vegan."
                secureTextEntry
              />
            )}
          />
          <BtnContainer>
            <Btn onPress={handleSubmit(onSubmit)} style={{ marginTop: 40 }}>
              {isFetching ? <Loader /> : <BtnText>Submit</BtnText>}
            </Btn>
            <BtnPlaceHolder onPress={handleSubmit(onSubmit)} style={{ marginTop: 20 }}>
              {isFetching ? <Loader /> : <BtnPlaceHolderText>Skip</BtnPlaceHolderText>}
            </BtnPlaceHolder>
          </BtnContainer>
          {mode.size > 1 && <CodeText>Code: {mode.code}</CodeText>}
        </Form>
      </Container>
    </TouchableWithoutFeedback>
  );
}
