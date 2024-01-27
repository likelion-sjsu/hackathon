import { SERVER_URL, getRoomData } from "api";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
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
  margin-top: 60px;
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
  margin-top: 150px;
  margin-bottom: 30px;
`;

export default function StandBy() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { code, role } = JSON.parse(localStorage.getItem("roomInfo"));
  const [percent, setPercent] = useState(0);
  const [periods, setPeriods] = useState(".");
  const { state } = useLocation();
  console.log(state.query);

  const Code = styled.div`
    position: absolute;
    top: 135px;
    right: 12px;
    font-size: 14px;
    font-family: "Montserrat", sans-serif;
    font-weight: 300;
    color: ${(props) => props.theme.secondaryFont};
  `;

  const { data, isLoading } = useQuery(
    ["room", code],
    () => getRoomData(code),
    {
      onSuccess: async ({ outcome, answered_count, max_count }) => {
        // FOR LEADER ONLY
        if (role === "leader") {
          if (answered_count === max_count) {
            const res = await fetch(`${SERVER_URL}/recommend/result/${code}`, {
              method: "GET",
            });
            if (!res.ok) {
              alert("There is something wrong in server..");
            }
          }
        }
        console.log(outcome);
        if (outcome !== "") {
          navigate("/result", {
            state: { result: outcome, query: state.query },
          });
        }
      },
      refetchInterval: 3000,
    }
  );

  const onclick = async () => {
    const res = await fetch(`${SERVER_URL}/recommend/result/${code}`, {
      method: "GET",
    });
    if (!res.ok) {
      alert("There is something wrong in server..");
    }
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
      <Code>Code: {code}</Code>
    </Container>
  );
}
