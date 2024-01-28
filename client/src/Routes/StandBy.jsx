import { SERVER_URL, getRoomData } from "api";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { PulseLoader } from "react-spinners";

const Container = styled.div`
  display: grid;
  place-content: center;
  width: 100vw;
  height: calc(100vh - 54px);
`;

const CenterBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 360px;
  height: 550px;
  margin: 0 auto;
  p {
    margin-top: 30px;
  }
`;

const ClosePollBtn = styled.button`
  position: absolute;
  bottom: 0;
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
  margin-bottom: 30px;
  margin-top: 60px;
`;

export default function StandBy() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { code, role } = JSON.parse(localStorage.getItem("roomInfo"));
  const [percent, setPercent] = useState(0);
  const { state } = useLocation();
  const [isFetching, setIsFetching] = useState(false);

  const { data, isLoading } = useQuery(
    ["room", code],
    () => getRoomData(code),
    {
      onSuccess: async ({ outcome, answered_count, max_count }) => {
        // FOR LEADER ONLY
        if (role === "leader") {
          if (answered_count === max_count) {
            setIsFetching(true);
            const res = await fetch(`${SERVER_URL}/recommend/result/${code}`, {
              method: "GET",
            });
            const data = await res.json();
            if (res.ok) {
              navigate("/result", {
                state: { result: data.outcome, query: state.query },
              });
            } else {
              alert("There is something wrong in server..");
            }
            setIsFetching(false);
          }
        }
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
    setIsFetching(true);
    const res = await fetch(`${SERVER_URL}/recommend/result/${code}`, {
      method: "GET",
    });
    const data = await res.json();
    if (res.ok) {
      navigate("/result", {
        state: { result: data.outcome, query: state.query },
      });
    } else {
      alert("There is something wrong in server..");
    }
    setIsFetching(false);
  };

  useEffect(
    () => data && setPercent((data.answered_count / data.max_count) * 100),
    [data]
  );

  return (
    <Container>
      <CenterBox>
        <Ring>
          <CircularProgressbar
            value={percent}
            text={
              isLoading ? "-" : data.answered_count + " of " + data.max_count
            }
            styles={{
              path: { stroke: theme.brandColor },
              text: { fill: theme.mainFont },
            }}
          />
        </Ring>
        <p>Code: {code}</p>
        <p>Please wait...</p>
        <p>We are collecting all the responses</p>
        {role === "leader" && (
          <ClosePollBtn onClick={onclick}>
            {isFetching ? (
              <PulseLoader size={8} color="whitesmoke" speedMultiplier={0.8} />
            ) : (
              "Close Poll"
            )}
          </ClosePollBtn>
        )}
      </CenterBox>
    </Container>
  );
}
