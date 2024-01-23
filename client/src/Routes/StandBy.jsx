import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div``;

export default function StandBy() {
  const navigate = useNavigate();
  const roomInfo = JSON.parse(localStorage.getItem("roomInfo"));
  console.log(roomInfo);

  // room data 5초 가져오기 (몇명이 답했는지, 끝났는지 계속 확인하기)
  // 끝났으면 /result 로 리디렉트

  const onclick = () => {
    // 서버에 끝났다고 알려줘
    // 10초 뒤에 db에서 삭제해야하는데...
    navigate("/result");
  };

  return (
    <Container>
      <div>다른 사람들 기다려.</div>
      <div>현재 13명이 답변했어</div>
      {roomInfo.role === "leader" && (
        <button onClick={onclick}>결과 볼래?</button>
      )}
    </Container>
  );
}
