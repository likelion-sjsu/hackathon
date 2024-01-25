import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Container = styled.main`
  display: grid;
  place-content: center;
  height: 100vh;
`;

export default function Result() {
  const location = useLocation();
  const { result } = location.state;
  return (
    <Container>
      <h1>{result}</h1>
    </Container>
  );
}
