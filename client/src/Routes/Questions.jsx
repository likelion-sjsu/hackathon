import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { questions } from "questions";
import { SERVER_URL } from "api";
import { Controller, useForm } from "react-hook-form";
import OptionBox from "components/OptionsBox";
import Pages from "components/Pages";
import { PulseLoader } from "react-spinners";

const Container = styled.main`
  width: 100vw;
  height: calc(100vh - 36px);
`;

const FlexBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 360px;
  margin: 0 auto;
  padding-top: 50px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px;
  margin-top: 32px;
`;

const SpecialOfferForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  width: calc(100vw - 48px);

  h1 {
    font-size: ${(props) => props.theme.fontBigTitle.fontSize};
    font-weight: ${(props) => props.theme.fontBigTitle.fontWeight};
    line-height: 50px;
    margin-bottom: 30px;
  }

  textarea {
    padding: 24px;
    margin-bottom: 40px;
    background-color: #f4f4f4;
    border-radius: 16px;
    border: none;
    outline: none;
    font-size: 17px;
    resize: none;
    &::placeholder {
      color: ${(props) => props.theme.secondaryFont};
    }
  }
`;

const SeeResultBtn = styled.button`
  width: 100%;
  height: 48px;
  margin-bottom: 20px;
  background-color: ${(props) => props.theme.brandColor};
  color: white;
  border: none;
  border-radius: 16px;
  outline: none;
  font-size: ${(props) => props.theme.fontBtn.fontSize};
  font-weight: ${(props) => props.theme.fontBtn.fontWeight};
  cursor: pointer;
`;

const SkipBtn = styled.input`
  background-color: transparent;
  min-height: 48px;
  border-radius: 16px;
  border: 1px solid #a6a6a6;
  outline: none;
  font-size: ${(props) => props.theme.fontBtn.fontSize};
  font-weight: ${(props) => props.theme.fontBtn.fontWeight};
  color: ${(props) => props.theme.secondaryFont};
  cursor: pointer;
`;

const NextBtn = styled.button`
  margin-top: 30px;
  width: 360px;
  min-height: 48px;
  border-radius: 16px;
  border: none;
  outline: none;
  background-color: ${(props) => props.theme.brandColor};
  font-size: ${(props) => props.theme.fontBtn.fontSize};
  font-weight: ${(props) => props.theme.fontBtn.fontWeight};
  color: white;
  transition: 0.2s all;
  cursor: pointer;
`;

const Code = styled.div`
  position: absolute;
  top: 135px;
  right: 12px;
  font-size: 14px;
  font-family: "Montserrat", sans-serif;
  font-weight: 300;
  color: ${(props) => props.theme.secondaryFont};
`;

export default function Questions() {
  const { handleSubmit, control } = useForm();
  const navigate = useNavigate();
  const { category } = useParams();
  const roomInfo = JSON.parse(localStorage.getItem("roomInfo"));
  const [page, setPage] = useState(0);
  const [answer, setAnswer] = useState({});
  const [value, setValue] = useState({});
  const questionData = questions[category];
  const [isFetching, setIsFetching] = useState(false);

  const submitForm = async (data) => {
    const formData = { ...answer, ...data };
    setIsFetching(true);

    /* Case 1. ROOM */
    if (roomInfo.role === "leader" || roomInfo.role === "member") {
      // 방 데이터에 추가만 하기
      const res = await fetch(`${SERVER_URL}/recommend?code=${roomInfo.code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) navigate("/standby", { state: { query: formData } }); // 대기창으로
    } else if (roomInfo.role === "individual") {
      /* Case 2. Individual */
      // 바로 open ai 로 결과 받아오기
      const res = await fetch(`${SERVER_URL}/recommend/${category}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        console.log(data);
        navigate("/result", {
          state: { result: data.result, query: formData },
        });
      } else {
        alert("There is something wrong in the server");
      }
    } else {
      alert("who are you");
    }
    setIsFetching(false);
  };

  const onclickNext = () => {
    if (Object.keys(value).length === 0) {
      console.log("한가지를 선택하세요");
      return;
    }
    setAnswer({
      ...answer,
      ...value,
    });
    setPage((prev) => (prev += 1));
    setValue({});
  };

  const onclickOption = (answerNumber) => {
    setValue({
      [questionData[page].key]: questionData[page].options[answerNumber].value,
    });
  };

  return (
    <Container>
      <FlexBox>
        {questionData[page] ? (
          <>
            <Pages total={questionData.length} current={page + 1} />
            <p style={{ width: "100%", marginTop: 24, paddingLeft: 12 }}>
              Choose one option
            </p>
            <h1
              style={{
                width: "100%",
                marginTop: 12,
                paddingLeft: 12,
                fontSize: 34,
                lineHeight: "42px",
              }}
            >
              {questionData[page].title}
            </h1>
            <OptionsContainer>
              {questionData[page].options.map((option, i) => (
                <OptionBox
                  key={i}
                  keycode={questionData[page].key}
                  text={option.display}
                  icon={option.icon}
                  selected={Object.values(value)[0] === option.value}
                  onClick={() => onclickOption(i)}
                />
              ))}
            </OptionsContainer>
            <NextBtn
              style={{
                background: Object.keys(value).length === 0 && "transparent",
                color: Object.keys(value).length === 0 && "#A6A6A6",
                border: Object.keys(value).length === 0 && "1px solid #A6A6A6",
              }}
              onClick={onclickNext}
            >
              Next
            </NextBtn>
          </>
        ) : (
          <>
            <SpecialOfferForm onSubmit={handleSubmit(submitForm)}>
              <h1>Is there anything we need to be aware of? (special note)</h1>
              <Controller
                name="special_offer"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <textarea {...field} rows={4} placeholder="Type here..." />
                )}
              />
              <SeeResultBtn type="submit">
                {isFetching ? (
                  <PulseLoader
                    size={8}
                    color="whitesmoke"
                    speedMultiplier={0.8}
                  />
                ) : (
                  "Submit"
                )}
              </SeeResultBtn>
              <SkipBtn type="submit" value="Skip" />
            </SpecialOfferForm>
          </>
        )}
      </FlexBox>
      {roomInfo.code !== "no-code" && <Code>Code: {roomInfo.code}</Code>}
    </Container>
  );
}
