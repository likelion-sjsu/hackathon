import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div``;

export default function Home() {
  return (
    <Container>
      <div>
        <div>환영문구</div>
        <div>설명문구</div>
        <Link to={""}>
          <div>시작하기 버튼</div>
        </Link>
      </div>
    </Container>
  );
}
