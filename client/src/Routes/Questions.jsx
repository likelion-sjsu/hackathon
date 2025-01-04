import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { questionsByCategory } from "questions";
import { SERVER_URL } from "api";
import { Controller, useForm } from "react-hook-form";
import OptionBox from "components/OptionsBox";
import Pages from "components/Pages";
import { PulseLoader } from "react-spinners";

const Container = styled.main`
  display: grid;
  place-content: center;
  width: 100vw;
  height: 100vh;
`;

const FlexBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 360px;
  height: 550px;
  margin: 0 auto;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
`;

const SpecialOfferForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  width: calc(100vw - 48px);
  margin-top: 30px;

  h1 {
    font-size: 28px;
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
  position: absolute;
  bottom: 68px;
  width: inherit;
  height: 48px;
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
  position: absolute;
  bottom: 0;
  width: inherit;
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

const PageBtns = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  gap: 10px;
  width: 360px;
`;
const PageBtn = styled.button`
  width: 100%;
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
  const questionData = questionsByCategory.find(
    (q) => q.name === category
  ).questions;
  const [answer, setAnswer] = useState(
    Array.from({ length: questionData.length }, (_, i) => [
      questionData[i].title,
      [],
    ])
  );
  // const [selectedOptionsIdx, setSelectedOptionsIdx] = useState(new Set());
  const [isFetching, setIsFetching] = useState(false);

  const submitForm = async ({ special_offer }) => {
    if (isFetching === true) return;
    const formData = [...answer, ["special offer", [{ value: special_offer }]]];
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
        navigate("/result", {
          state: { results: data, query: formData },
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
    if (answer[page][1].length === 0) {
      return;
    }

    setPage((prev) => (prev += 1));
    // setanswer[page](new Set());
  };

  const onClickPrev = () => {
    setPage((prev) => (prev -= 1));
  };

  const onclickOption = (answerNumber) => {
    setAnswer((prev) => {
      const result = [...prev];
      const selectedAnswer = questionData[page].options[answerNumber];

      // unselect
      if (result[page][1].includes(selectedAnswer)) {
        result[page][1] = result[page][1].filter(
          (answer) => answer.index !== selectedAnswer.index
        );
        return result;
      }

      // select
      if (selectedAnswer.icon === "🚫") {
        result[page][1] = [];
      } else {
        result[page][1] = result[page][1].filter(
          (answer) => answer.icon !== "🚫"
        );
      }
      result[page][1].push(selectedAnswer);
      return result;
    });
  };

  return (
    <Container>
      <FlexBox>
        <Pages total={questionData.length} current={page + 1} />
        {questionData[page] ? (
          <>
            <p style={{ width: "100%", marginTop: 24, paddingLeft: 12 }}>
              Choose multiple options
            </p>
            <h1
              style={{
                width: "100%",
                marginTop: 12,
                paddingLeft: 12,
                fontSize: 28,
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
                  option={option}
                  twoOptions={questionData[page].options.length === 3}
                  selected={answer[page][1].includes(option)}
                  onClick={() => onclickOption(i)}
                />
              ))}
            </OptionsContainer>
            <PageBtns>
              <PageBtn
                style={{
                  display: page === 0 ? "none" : "block",
                }}
                onClick={onClickPrev}
              >
                Back
              </PageBtn>
              <PageBtn
                style={{
                  background: answer[page][1].length === 0 && "transparent",
                  color: answer[page][1].length === 0 && "#A6A6A6",
                  border: answer[page][1].length === 0 && "1px solid #A6A6A6",
                }}
                onClick={onclickNext}
              >
                Next
              </PageBtn>
            </PageBtns>
          </>
        ) : (
          <>
            <SpecialOfferForm onSubmit={handleSubmit(submitForm)}>
              <h1>Any special notes we need to be aware of?</h1>
              <Controller
                name="special_offer"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={4}
                    placeholder="ex) I am a vegan."
                  />
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
