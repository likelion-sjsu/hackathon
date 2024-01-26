import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { questions } from "questions";
import { SERVER_URL } from "api";
import { Controller, useForm } from "react-hook-form";

const Container = styled.main`
  display: grid;
  place-content: center;
  width: 100vw;
  height: calc(100vh - 36px);
`;

const CenterBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const Title = styled.div`
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 600;
`;

const Card = styled.div`
  position: relative;
  left: 16px;
  width: 331px;
  height: 468px;
  background-color: #fff1f1;
  border: 1px solid #ff9090;
  border-radius: 24px;
  padding: 80px 24px 0 24px;
  box-shadow: 3px 3px 4px rgba(172, 172, 172, 0.2);
  h1 {
    font-size: ${(props) => props.theme.fontBigTitle.fontSize};
    font-weight: ${(props) => props.theme.fontBigTitle.fontWeight};
    line-height: 50px;
    margin-bottom: 30px;
  }
`;

const Page = styled.p`
  position: absolute;
  top: 24px;
  right: 24px;
`;

const BtnGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 280px;
  height: 280px;
`;

const BigBtn = styled.div`
  display: grid;
  place-content: center;
  width: 100px;
  height: 100px;
  background-color: white;
  border: 1px solid #ff9090;
  border-radius: 16px;
  color: #ff9090;
  font-size: 30px;
  cursor: pointer;
  transition: 0.2s all;

  &:hover {
    background-color: #ff9090;
    color: white;
  }
`;

const SmallBtn = styled.div`
  display: grid;
  place-content: center;
  width: 80px;
  height: 80px;
  background-color: white;
  border: 1px solid #ff9090;
  border-radius: 16px;
  color: #ff9090;
  font-size: 30px;
  cursor: pointer;
  transition: 0.2s all;

  &:hover {
    background-color: #ff9090;
    color: white;
  }
`;

const ExtraCard1 = styled.div`
  position: absolute;
  left: 40px;
  top: 24px;
  width: 300px;
  height: 420px;
  background-color: #ffe0e0;
  border-radius: 16px;
  box-shadow: 3px 3px 2px rgba(172, 172, 172, 0.25);
  z-index: -1;
`;
const ExtraCard2 = styled.div`
  position: absolute;
  left: 52px;
  top: 44px;
  width: 300px;
  height: 381px;
  background-color: #f6d3d3;
  border-radius: 16px;
  box-shadow: 3px 3px 2px rgba(172, 172, 172, 0.25);
  z-index: -2;
`;

const SpecialOfferForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
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
    &::placeholder {
      color: ${(props) => props.theme.secondaryFont};
    }
  }
`;
const SeeResultBtn = styled.input`
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
`;
const SkipBtn = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  font-size: ${(props) => props.theme.fontBtn.fontSize};
  font-weight: ${(props) => props.theme.fontBtn.fontWeight};
  color: ${(props) => props.theme.secondaryFont};
`;

export default function Questions() {
  const { handleSubmit, control } = useForm();
  const navigate = useNavigate();
  const { category } = useParams();
  const roomInfo = JSON.parse(localStorage.getItem("roomInfo"));
  const [page, setPage] = useState(0);
  const [answer, setAnswer] = useState({});
  const questionData = questions[category];

  const onclick = async (answerNumber) => {
    setAnswer({
      ...answer,
      [questionData[page].key]: questionData[page].options[answerNumber].value,
    });
    setPage((prev) => (prev += 1));
  };

  const submitForm = async (data) => {
    const formData = { ...answer, ...data };
    console.log(formData);
    /* Case 1. ROOM */
    if (roomInfo.role === "leader" || roomInfo.role === "member") {
      // 방 데이터에 추가만 하기
      const res = await fetch(`${SERVER_URL}/recommend/${roomInfo.code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answer),
      });
      if (res.ok) navigate("/standby"); // 대기창으로
    } else if (roomInfo.role === "individual") {
      /* Case 2. Individual */
      // 바로 open ai 로 결과 받아오기
      const res = await fetch(`${SERVER_URL}/recommend/food/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answer),
      });
      const data = await res.json();

      if (res.ok) {
        console.log(data);
        navigate("/result", { state: { result: data.result } });
      } else {
        alert("There is something wrong in the server");
      }
    } else {
      alert("who are you");
    }
  };

  return (
    <Container>
      <CenterBox>
        <Title>{questionData[page] ? "Questions" : "One more question!"}</Title>
        {questionData[page] ? (
          <Card>
            <Page>
              {page + 1}/{questionData.length}
            </Page>
            <h1>{questionData[page].title}</h1>
            <BtnGroup>
              {questionData[page].options.map((option, i) =>
                questionData[page].options.length > 4 ? (
                  <SmallBtn
                    key={i}
                    onClick={() => {
                      onclick(i);
                    }}
                  >
                    {option.display}
                  </SmallBtn>
                ) : (
                  <BigBtn
                    key={i}
                    onClick={() => {
                      onclick(i);
                    }}
                  >
                    {option.display}
                  </BigBtn>
                )
              )}
            </BtnGroup>
            <ExtraCard1 />
            <ExtraCard2 />
          </Card>
        ) : (
          <>
            <SpecialOfferForm onSubmit={handleSubmit(submitForm)}>
              <h1>Is there anything we need to be aware of? </h1>
              <Controller
                name="special_offer"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <textarea {...field} rows={4} placeholder="Type here..." />
                )}
              />
              <SeeResultBtn type="submit" value={"See Result"} />
              <SkipBtn type="submit" value="skip" />
            </SpecialOfferForm>
          </>
        )}
      </CenterBox>
    </Container>
  );
}
