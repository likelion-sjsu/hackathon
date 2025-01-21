import { Btn, BtnText, Container, Subtitle } from "@/styles/GlobalStyle";
import { Text, View } from "react-native";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { modeAtom } from "@/utils/atoms";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "react-query";
import { getRoomData, SERVER_URL } from "@/utils/api";
import { theme } from "@/styles/theme";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const ringSize = 200;

const RingContainer = styled(View)`
  width: ${ringSize}px;
  height: ${ringSize}px;
  margin: 50px 0;
`;

const RingText = styled(Text)`
  font-family: ${(props) => props.theme.fonts.medium};
  font-size: ${(props) => props.theme.fontSize.medium};
`;

const Span = styled(Text)`
  font-family: ${(props) => props.theme.fonts.regular};
  font-size: ${(props) => props.theme.fontSize.smaller};
  margin-bottom: 30px;
`;

export default function Standby() {
  const { push } = useRouter();
  const [mode, _] = useRecoilState(modeAtom);
  const { answers } = useLocalSearchParams<{ answers: string }>();
  const { role, code } = mode;
  const [percent, setPercent] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [redirected, setRedirected] = useState(false);

  const { data, isLoading } = useQuery<any>(["room", code], () => getRoomData(mode.code), {
    onSuccess: async ({ outcome, answered_count, max_count }) => {
      if (redirected) return;

      // FOR LEADER ONLY
      if (role === 0) {
        if (answered_count === max_count) {
          if (isFetching === true) return;
          setIsFetching(true);
          const res = await fetch(`${SERVER_URL}/recommend/result/${code}`, {
            method: "GET",
          });
          const data = await res.json();

          if (res.ok) {
            setRedirected(true);
            push({ pathname: "/result", params: { data: JSON.stringify(data) } });
          } else {
            alert("There is something wrong in server..");
          }
          setIsFetching(false);
        }
      }
      if (outcome !== "") {
        setRedirected(true);
        push({
          pathname: "/result",
          params: {
            results: JSON.parse(outcome.replace(/'/g, '"')),
          },
        });
      }
    },
    refetchInterval: 3000,
  });

  const closePoll = async () => {
    if (isFetching === true) return;
    setIsFetching(true);
    const res = await fetch(`${SERVER_URL}/recommend/result/${code}`, {
      method: "GET",
    });
    const data = await res.json();
    if (res.ok) {
      setRedirected(true);
      push({
        pathname: "/result",
        params: {
          data: JSON.stringify(data),
        },
      });
    } else {
      alert("There is something wrong in server..");
    }
    setIsFetching(false);
  };

  useEffect(() => data && setPercent((data.answered_count / data.max_count) * 100), [data]);

  return (
    <Container style={{ alignItems: "center" }}>
      <RingContainer>
        <AnimatedCircularProgress
          size={ringSize}
          width={20}
          backgroundWidth={12}
          fill={percent}
          backgroundColor="#eee"
          tintColor={theme.colors.light.primary}
          rotation={0}
          lineCap="round"
          children={() => <RingText>{isLoading ? "-" : data.answered_count + " of " + data.max_count}</RingText>}
        />
      </RingContainer>
      <Span>Code: {mode.code}</Span>
      <Span>Please wait...</Span>
      <Span>We are collecting all the responses</Span>
      {mode.role === 0 && <Btn onPress={closePoll}>{isFetching ? <Loader /> : <BtnText>Close Poll</BtnText>}</Btn>}
    </Container>
  );
}
