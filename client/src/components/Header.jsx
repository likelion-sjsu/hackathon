import React from "react";
import styled from "styled-components";
import MobileTopIcons from "./MobileTopIcons";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";

const Container = styled.header`
  position: sticky;
  top: 0;
  background-color: transparent;
`;

const LogoHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const PrevPageBtn = styled.button`
  position: absolute;
  left: 30px;
  svg {
    height: 24px;
  }
`;

const previosPages = ["/mode", "/category", "/create", "/join"];
export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Container>
      <MobileTopIcons />
      <LogoHeader>
        {previosPages.includes(pathname) === true && (
          <PrevPageBtn onClick={() => navigate(-1)}>
            <ChevronLeftIcon />
          </PrevPageBtn>
        )}
        <Logo />
      </LogoHeader>
    </Container>
  );
}
