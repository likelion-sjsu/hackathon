import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import SoloIcon from "../assets/Solo-icon.svg";
import GroupCreateIcon from "../assets/Group-create-icon.svg";
import GroupJoinIcon from "../assets/Group-join-icon.svg";

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

const Box = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 360px;
  height: 140px;
  margin-bottom: 24px;
  border: 1px solid;
  border-radius: 16px;
  cursor: pointer;

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

export default function SelectMode() {
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(
    () =>
      localStorage.setItem(
        "roomInfo",
        JSON.stringify({ role: "individual", code: "no-code" })
      ),
    []
  );

  return (
    <Container>
      <CenterBox>
        <Title>Choose Category</Title>
        <Box
          style={{ borderColor: theme.brandColor }}
          onClick={() => navigate("/category")}
        >
          <Image>
            <img src={SoloIcon} alt="" />
          </Image>
          <Content>
            <h1>Solo</h1>
            <p>Decide for yourself!</p>
          </Content>
          <ChevronRightIcon />
        </Box>

        <Box
          style={{ borderColor: theme.groupCreate }}
          onClick={() => navigate("/create")}
        >
          <Image>
            <img src={GroupCreateIcon} alt="" />
          </Image>
          <Content>
            <h1>Make Group</h1>
            <p>Create your own group!</p>
          </Content>
          <ChevronRightIcon />
        </Box>

        <Box
          style={{ borderColor: theme.groupJoin }}
          onClick={() => navigate("/join")}
        >
          <Image>
            <img src={GroupJoinIcon} alt="" />
          </Image>
          <Content>
            <h1>Join Group</h1>
            <p>Join with 4-digit code!</p>
          </Content>
          <ChevronRightIcon />
        </Box>
      </CenterBox>
    </Container>
  );
}
