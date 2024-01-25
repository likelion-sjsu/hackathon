import {
  ChevronLeftIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logo.svg";

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

const Subtitle = styled.div`
  position: absolute;
  left: 36px;
  margin-top: 100px;
  font-size: ${(props) => props.theme.fontTitle.fontSize};
  font-weight: ${(props) => props.theme.fontTitle.fontWeight};
`;

const Title = styled.div`
  margin-top: 210px;
  margin-left: 36px;
  margin-right: 36px;
  font-size: ${(props) => props.theme.fontBigTitle.fontSize};
  font-weight: ${(props) => props.theme.fontBigTitle.fontWeight};
`;

const Box = styled.div`
  display: flex;
  justify-content: space-between;
  width: 280px;
  margin-top: 110px;
  svg {
    cursor: pointer;
  }
  div {
    display: grid;
    place-content: center;
    width: 144px;
    height: 144px;
    border-radius: 144px;
    background-color: rgba(234, 211, 242, 0.5);
    font-size: 48px;
    font-weight: 600;
  }
`;

const CreateBtn = styled.button`
  position: absolute;
  bottom: 60px;
  right: 36px;
  width: 107px;
  height: 48px;
  border-radius: 16px;
  border: none;
  outline: none;
  background-color: ${(props) => props.theme.brandColor};
  font-size: ${(props) => props.theme.fontBtn.fontSize};
  font-weight: ${(props) => props.theme.fontBtn.fontWeight};
  color: white;
  cursor: pointer;
`;

export default function CreateGroup() {
  const navigate = useNavigate();
  const [num, setNum] = useState(1);

  const onClickCreateRoom = () => {
    localStorage.setItem(
      "roomInfo",
      JSON.stringify({ role: "leader", size: num })
    );
    navigate("/category");
  };

  return (
    <Container>
      <Header>
        <Link to={"/mode"}>
          <ChevronLeftIcon />
        </Link>
        <img src={Logo} alt="logo" />
      </Header>
      <Subtitle>Create a Group</Subtitle>
      <Title>How many people are in your group?</Title>
      <Box>
        <MinusIcon
          onClick={() => num > 1 && setNum((prev) => prev - 1)}
          width={40}
        />
        <div>{num}</div>
        <PlusIcon
          onClick={() => num < 20 && setNum((prev) => prev + 1)}
          width={40}
        />
      </Box>
      <CreateBtn onClick={onClickCreateRoom}>Create</CreateBtn>
    </Container>
  );
}
