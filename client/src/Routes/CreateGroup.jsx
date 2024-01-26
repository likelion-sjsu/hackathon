import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.main`
  display: grid;
  place-content: center;
  width: 100vw;
  height: calc(100vh - 36px);
`;

const CenterBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 360px;
`;

const Subtitle = styled.div`
  font-size: ${(props) => props.theme.fontBigTitle.fontSize};
  font-weight: ${(props) => props.theme.fontBigTitle.fontWeight};
  padding-left: 12px;
`;

const Title = styled.div`
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 600;
  padding-left: 12px;
`;

const Box = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  margin-top: 80px;
  svg {
    cursor: pointer;
  }
  div {
    display: grid;
    place-content: center;
    width: 144px;
    height: 144px;
    border: 3px solid #7e518e;
    border-radius: 144px;
    font-size: 48px;
    font-weight: 600;
  }
`;

const CreateBtn = styled.button`
  margin-top: 80px;
  width: 360px;
  min-height: 48px;
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
      <CenterBox>
        <Title>Create a Group</Title>
        <Subtitle>How many people are in your group?</Subtitle>
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
      </CenterBox>
    </Container>
  );
}
