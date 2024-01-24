import { SERVER_URL, getRoomData } from "api";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div``;

export default function StandBy() {
  const navigate = useNavigate();
  const { code, role, category } = JSON.parse(localStorage.getItem("roomInfo"));
  const { data, isLoading } = useQuery(
    ["room", code],
    () => getRoomData(code),
    {
      onSuccess: async (data) => {
        if (data.end === true) {
          const res = await fetch(
            `${SERVER_URL}/recommend/${category}/${code}`
          );
          const result = await res.json();
          console.log(res.status, result);
          if (res.ok) navigate("/result", { state: result });
        }
      },
      refetchInterval: 2000,
    }
  );

  const onclick = async () => {
    const res = await fetch(`${SERVER_URL}/room/${code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ end: true }),
    });
    const data = await res.json();
    console.log(res.status, data);
  };

  return (
    <Container>
      <div>다른 사람들 기다려.</div>
      <div>현재 {isLoading ? 0 : data.answered_count}명이 답변했어</div>
      {role === "leader" && <button onClick={onclick}>결과 볼래?</button>}
    </Container>
  );
}
