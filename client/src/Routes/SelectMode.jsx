import { SERVER_URL } from "api";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Solo from "../assets/solo.png";
import Leader from "../assets/leader.png";
import Member from "../assets/member.png";
import useDigitInput from "react-digit-input";

const Container = styled.main`
  display: grid;
  place-content: center;
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

  h1 {
    font-size: 17px;
    font-weight: 600;
  }

  a {
    position: absolute;
    left: 40px;
    svg {
      height: 24px;
    }
  }
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

const Box = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 360px;
  height: 140px;
  margin-bottom: 24px;
  border: 1px solid;
  border-radius: 16px;

  svg {
    position: absolute;
    right: 24px;
    height: 24px;
  }
`;
const Image = styled.div`
  margin-left: 24px;
  margin-right: 20px;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;

  h1 {
    margin-bottom: 16px;
  }
`;

const DigitGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
`;
const Label = styled.label`
  position: relative;
  width: 36px;
  height: 45px;
  &:focus-within > div {
    box-shadow: inset 0 2px 5px 0 rgba(9, 30, 66, 0.2);
    background-color: white;
    color: black;
    outline: none;
  }
  hr {
    border: none;
    position: absolute;
    bottom: 7px;
    left: 8px;
    width: 20px;
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
  width: 36px;
  height: 45px;
  border: none;
  border-radius: 3px;
  background-color: #eeeeee;
`;
const Input = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 36px;
  height: 45px;
  opacity: 0;
`;

const ErrorMsg = styled.p`
  font-size: 10px;
  color: red;
  height: 10px;
`;

export default function SelectMode() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [code, onChange] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const digits = useDigitInput({
    acceptedCharacters: /^[0-9]$/,
    length: 4,
    value: code,
    onChange,
  });

  const joinRoom = async () => {
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
      onChange("");
      setErrorMsg("Group does not exist.");
    } else {
      alert("뭐야 이건");
    }
  };

  const onClickCreateRoom = () => {
    localStorage.setItem("roomInfo", JSON.stringify({ role: "leader" }));
    navigate("/category");
  };

  useEffect(
    () =>
      localStorage.setItem(
        "roomInfo",
        JSON.stringify({ role: "individual", code: "no-code" })
      ),
    []
  );

  useEffect(() => {
    const delayedFunction = () => {
      setErrorMsg("");
    };
    const timeoutId = setTimeout(delayedFunction, 5000);
    return () => clearTimeout(timeoutId);
  }, [errorMsg]);

  return (
    <Container>
      <Header>
        <Link to={"/"}>
          <ChevronLeftIcon />
        </Link>
        <h1>Logo</h1>
      </Header>

      <CenterBox>
        <Title>Choose Category</Title>

        <Box
          style={{ borderColor: theme.brandColor }}
          onClick={() => navigate("/category")}
        >
          <Image>
            <img src={Solo} alt="" />
          </Image>
          <Content>
            <h1>Solo</h1>
            <p>Let's go somewhere fun!</p>
          </Content>
          <ChevronRightIcon />
        </Box>

        <Box
          style={{ borderColor: theme.groupCreate }}
          onClick={onClickCreateRoom}
        >
          <Image>
            <img src={Leader} alt="" />
          </Image>
          <Content>
            <h1>Make Group</h1>
            <p>Let's go somewhere fun!</p>
          </Content>
          <ChevronRightIcon />
        </Box>

        <Box style={{ borderColor: theme.groupJoin }}>
          <Image>
            <img src={Member} alt="" />
          </Image>
          <Content>
            <h1
              style={{
                marginBottom: "10px",
                marginTop: "15px",
              }}
            >
              Join Group
            </h1>
            <DigitGroup>
              <Label>
                <Digit>{code[0]}</Digit>
                <hr />
                <Input inputMode="decimal" {...digits[0]} />
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
          </Content>
          <ChevronRightIcon onClick={joinRoom} />
        </Box>
      </CenterBox>
    </Container>
  );
}
