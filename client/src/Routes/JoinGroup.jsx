import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { SERVER_URL } from "api";
import Logo from "components/Logo";
import React, { useEffect, useRef, useState } from "react";
import useDigitInput from "react-digit-input";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: calc(100vh - 36px);
`;

const Header = styled.div`
  position: absolute;
  top: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  a {
    position: absolute;
    left: 40px;
    svg {
      height: 24px;
    }
  }
`;

const Title = styled.div`
  position: absolute;
  left: 36px;
  margin-top: 100px;
  font-size: ${(props) => props.theme.fontTitle.fontSize};
  font-weight: ${(props) => props.theme.fontTitle.fontWeight};
`;
const SubTitle = styled.div`
  margin-top: 260px;
  font-size: ${(props) => props.theme.fontTitle.fontSize};
  font-weight: ${(props) => props.theme.fontTitle.fontWeight};
`;

const DigitGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 30px;
`;
const Label = styled.label`
  position: relative;
  width: 60px;
  height: 80px;
  font-size: 30px;
  &:focus-within > div {
    box-shadow: inset 0 2px 5px 0 rgba(9, 30, 66, 0.2);
    background-color: white;
    color: black;
    outline: none;
  }
  hr {
    border: none;
    position: absolute;
    bottom: 13px;
    left: 12px;
    width: 36px;
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
  width: 60px;
  height: 80px;
  border: none;
  border-radius: 10px;
  background-color: #eeeeee;
`;
const Input = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 80px;
  opacity: 0;
`;

const ErrorMsg = styled.p`
  margin-top: 10px;
  font-size: 15px;
  color: red;
  height: 10px;
`;

export default function JoinGroup() {
  const navigate = useNavigate();
  const [code, onChange] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const firstInputRef = useRef();
  const digits = useDigitInput({
    acceptedCharacters: /^[0-9]$/,
    length: 4,
    value: code,
    onChange,
  });

  useEffect(() => {
    const delayedFunction = () => {
      setErrorMsg("");
    };
    const timeoutId = setTimeout(delayedFunction, 5000);
    return () => clearTimeout(timeoutId);
  }, [errorMsg]);

  useEffect(() => {
    async function joinRoom() {
      if (!/^\d{4}$/.test(code)) {
        setErrorMsg("Please enter 4 digits.");
        onChange("");
        return;
      }

      setErrorMsg("");
      const res = await fetch(`${SERVER_URL}/room/${code}`);
      const data = await res.json();

      console.log(res.status, data);
      if (res.ok) {
        localStorage.setItem(
          "roomInfo",
          JSON.stringify({ role: "member", code: data.code })
        );
        navigate("/category/food");
      } else if (res.status === 404) {
        console.log(firstInputRef.current);
        onChange("");
        setErrorMsg("Group does not exist.");
      } else {
        alert("뭐야 이건");
      }
    }
    if (code.trim().length === 4) joinRoom();
  }, [code, navigate]);

  return (
    <Container>
      <Header>
        <Link to={"/mode"}>
          <ChevronLeftIcon />
        </Link>
        <Logo />
      </Header>
      <Title>Join a Group</Title>
      <SubTitle>Enter the 4-digit code</SubTitle>
      <DigitGroup>
        <Label>
          <Digit>{code[0]}</Digit>
          <hr />
          <Input ref={firstInputRef} inputMode="decimal" {...digits[0]} />
        </Label>
        <Label>
          <Digit>{code[1]}</Digit>
          <hr />
          <Input inputMode="decimal" {...digits[1]} />
        </Label>
        <Label>
          <Digit>{code[2]}</Digit>
          <hr />
          <Input inputMode="decimal" {...digits[2]} />
        </Label>
        <Label>
          <Digit>{code[3]}</Digit>
          <hr />
          <Input inputMode="decimal" {...digits[3]} />
        </Label>
      </DigitGroup>
      <ErrorMsg>{errorMsg}</ErrorMsg>
    </Container>
  );
}
