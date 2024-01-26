import { SERVER_URL, getRoomData } from "api";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    margin-top: 30px;
  }
`;

const ClosePollBtn = styled.button`
  position: absolute;
  bottom: 90px;
  background-color: ${(props) => props.theme.brandColor};
  font-size: ${(props) => props.theme.fontBtn.fontSize};
  font-weight: ${(props) => props.theme.fontBtn.fontWeight};
  color: white;
  border-radius: 16px;
  border: none;
  outline: none;
  width: 360px;
  height: 48px;
`;

const Ring = styled.div`
  width: 160px;
  height: 160px;
  margin-top: 210px;
  margin-bottom: 30px;
`;

export default function StandBy() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { code, role, category } = JSON.parse(localStorage.getItem("roomInfo"));
  const [percent, setPercent] = useState(0);
  const [periods, setPeriods] = useState(".");

  const { data, isLoading } = useQuery(
    ["room", code],
    () => getRoomData(code),
    {
      onSuccess: async (data) => {
        if (data.end === true) {
          const res = await fetch(
            `${SERVER_URL}/recommend/result/${category}/${code}`,
            { method: "POST" }
          );
          const result = await res.json();
          console.log(res.status, result);
          if (res.ok) navigate("/result", { state: result });
        }
      },
      refetchInterval: 5000,
    }
  );

  const onclick = async () => {
    const res = await fetch(`${SERVER_URL}/room/${code}`, { method: "PUT" });
    const data = await res.json();
    console.log(res.status, data);
  };

  useEffect(
    () => data && setPercent((data.answered_count / data.max_count) * 100),
    [data]
  );

  useEffect(() => {
    const delayedFunction = () => {
      if (periods === "...") {
        setPeriods(".");
        return;
      }
      setPeriods((prev) => prev + ".");
    };
    const timeoutId = setTimeout(delayedFunction, 1000);
    return () => clearTimeout(timeoutId);
  }, [periods]);

  return (
    <Container>
      <Ring>
        <CircularProgressbar
          value={percent}
          text={isLoading ? "-" : data.answered_count + " of " + data.max_count}
          styles={{
            path: { stroke: theme.brandColor },
            text: { fill: theme.mainFont },
          }}
        />
      </Ring>
      <p>Please wait.</p>
      <p>We are collecting all the responses{periods}</p>
      {role === "leader" && (
        <ClosePollBtn onClick={onclick}>Close Poll</ClosePollBtn>
      )}
    </Container>
  );
}
