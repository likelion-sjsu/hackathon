import { SERVER_URL } from "api";
import React, { useEffect, useState } from "react";
import useDigitInput from "react-digit-input";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: calc(100vh - 36px);
`;

const Title = styled.div`
  margin-top: 160px;
  font-size: ${(props) => props.theme.fontTitle.fontSize};
  font-weight: ${(props) => props.theme.fontTitle.fontWeight};
`;

const SubTitle = styled.div`
  margin-top: 20px;
  font-size: ${(props) => props.theme.fontBody.fontSize};
  font-weight: ${(props) => props.theme.fontBody.fontWeight};
`;

const DigitGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 40px;
`;
const Label = styled.label`
  position: relative;
  width: 80px;
  height: 80px;
  font-size: 30px;

  &:focus-within > div {
    /* box-shadow: inset 0 2px 5px 0 rgba(9, 30, 66, 0.2); */
    background-color: white;
    color: black;
    outline: 1px solid ${(props) => props.theme.brandColor};
  }
  hr {
    border: none;
    position: absolute;
    bottom: 13px;
    left: 24px;
    width: 32px;
    height: 2px;
    opacity: 0.6;
    background-color: #b6abdf;
    margin: 0;
    padding: 0;
  }
`;
const Digit = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border: none;
  border-radius: 10px;
  background-color: #f4f4f4;
`;
const Input = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 80px;
  opacity: 0;
`;

const ErrorMsg = styled.p`
  font-size: 14px;
  color: #e80c0c;
  height: 10px;
  margin-top: 8px;
`;

const BtnPlaceholder = styled.button`
  background-color: transparent;
  font-size: ${(props) => props.theme.fontBtn.fontSize};
  font-weight: ${(props) => props.theme.fontBtn.fontWeight};
  color: ${(props) => props.theme.secondaryFont};
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.secondaryFont};
  outline: none;
  width: 360px;
  height: 48px;
  margin-top: 24px;
`;

const NextBtn = styled.button`
  background-color: ${(props) => props.theme.brandColor};
  font-size: ${(props) => props.theme.fontBtn.fontSize};
  font-weight: ${(props) => props.theme.fontBtn.fontWeight};
  color: white;
  border-radius: 16px;
  border: none;
  outline: none;
  width: 360px;
  height: 48px;
  margin-top: 24px;
`;

export default function JoinGroup() {
  const navigate = useNavigate();
  const [code, onChange] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [category, setCategory] = useState("");
  const digits = useDigitInput({
    acceptedCharacters: /^[0-9]$/,
    length: 4,
    value: code,
    onChange,
  });

  useEffect(() => {
    const delayedFunction = () => {
      if (authorized === false) {
        onChange("");
        setErrorMsg("");
      }
    };
    const timeoutId = setTimeout(delayedFunction, 3000);
    return () => clearTimeout(timeoutId);
  }, [authorized, errorMsg]);

  useEffect(() => {
    async function joinRoom() {
      if (!/^\d{4}$/.test(code)) {
        setErrorMsg("Please enter 4 digits.");
        return;
      }
      const res = await fetch(`${SERVER_URL}/room/${code}`);
      const data = await res.json();

      setErrorMsg("");
      if (res.ok) {
        if (data.outcome !== "") {
          setAuthorized(false);
          setErrorMsg("Invalid code (terminated)");
          return;
        }
        if (data.answered_count === data.max_count) {
          setAuthorized(false);
          setErrorMsg("Invalid code (full group)");
          return;
        }
        setCategory(data.category);
        setAuthorized(true);
      } else if (res.status === 404) {
        setAuthorized(false);
        setErrorMsg("Invalid code (group  not exist)");
      } else {
        alert("뭐야 이건");
      }
    }
    if (code.trim().length === 4) joinRoom();
  }, [code, navigate]);

  const onClickNext = () => {
    localStorage.setItem(
      "roomInfo",
      JSON.stringify({ role: "member", code, category })
    );
    navigate(`/category/${category}`);
  };

  return (
    <Container>
      <Title>Verification Code</Title>
      <SubTitle>Enter the 4-digit code</SubTitle>
      <DigitGroup>
        <Label>
          <Digit
            style={{
              outline: errorMsg === "" ? "" : "1px solid red",
            }}
          >
            {code[0]}
          </Digit>
          <hr />
          <Input inputMode="decimal" {...digits[0]} />
        </Label>
        <Label>
          <Digit
            style={{
              outline: errorMsg === "" ? "" : "1px solid red",
            }}
          >
            {code[1]}
          </Digit>
          <hr />
          <Input inputMode="decimal" {...digits[1]} />
        </Label>
        <Label>
          <Digit
            style={{
              outline: errorMsg === "" ? "" : "1px solid red",
            }}
          >
            {code[2]}
          </Digit>
          <hr />
          <Input inputMode="decimal" {...digits[2]} />
        </Label>
        <Label>
          <Digit
            style={{
              outline: errorMsg === "" ? "" : "1px solid red",
            }}
          >
            {code[3]}
          </Digit>
          <hr />
          <Input inputMode="decimal" {...digits[3]} />
        </Label>
      </DigitGroup>
      <ErrorMsg>{errorMsg}</ErrorMsg>
      {authorized ? (
        <NextBtn onClick={onClickNext}>Next</NextBtn>
      ) : (
        <BtnPlaceholder>Next</BtnPlaceholder>
      )}
    </Container>
  );
}
