import Option from "@/components/Option";
import PageIndicator from "@/components/PageIndicator";
import { Btn, BtnText, CodeText, Container, Subtitle, Title } from "@/styles/GlobalStyle";
import { theme } from "@/styles/theme";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import styled from "styled-components";
import SpecialRequest from "./special-request";
import { useRecoilState } from "recoil";
import { modeAtom } from "@/utils/atoms";
import { useQuery } from "react-query";
import { getCategory, getCategoryList } from "@/utils/api";

const FlexBox = styled(View)`
  flex: 1;
  align-items: center;
  width: 360px;
  margin: 0 auto;
`;

const OptionsContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
`;

const PageBtnContainer = styled(View)`
  justify-content: center;
  position: absolute;
  bottom: 150px;
  flex-direction: row;
  gap: 10px;
`;

type answerType = [
  string,
  {
    index: number;
    icon: string;
    value: string;
  }[]
];

type Question = {
  color: string;
  id: number;
  name: string;
  questions: {
    title: string;
    multiple: boolean;
    options: {
      index: number;
      icon: string;
      value: string;
    }[];
  }[];
};

export default function Questions() {
  const { id } = useLocalSearchParams();
  const [page, setPage] = useState(0);
  const [mode, _] = useRecoilState(modeAtom);

  const { data: categoryData, isLoading } = useQuery<Question>(["category", id], {
    queryFn: () => getCategory(id),
  });

  const questions = categoryData?.questions || [];
  const [answers, setAnswers] = useState<answerType[]>(
    Array.from({ length: questions.length }, (_, i) => [questions[i].title, []])
  );

  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(Array.from({ length: questions.length }, (_, i) => [questions[i].title, []]));
    }
  }, [questions]);

  const isSelecting = answers[page] && answers[page][1] ? answers[page][1].length > 0 : false;

  const onclickNext = () => {
    if (answers[page][1].length === 0) {
      return;
    }
    setPage((prev) => (prev += 1));
  };

  const onClickPrev = () => {
    setPage((prev) => (prev -= 1));
  };

  const onclickOption = (answerNumber) => {
    /* MULTIPLE SELETION */
    if (questions[page].multiple) {
      setAnswers((prev) => {
        const result = [...prev];
        const selectedAnswer = questions[page].options[answerNumber];

        // unselect
        if (result[page][1].includes(selectedAnswer)) {
          result[page][1] = result[page][1].filter((answer) => answer.index !== selectedAnswer.index);
          return result;
        }

        // select
        if (selectedAnswer.icon === "🚫") {
          result[page][1] = [];
        } else {
          result[page][1] = result[page][1].filter((answer) => answer.icon !== "🚫");
        }
        result[page][1].push(selectedAnswer);
        return result;
      });
    } else {
      /* SINGLE SELECTION */
      setAnswers((prev) => {
        const result = [...prev];
        const selectedAnswer = questions[page].options[answerNumber];

        // unselect
        if (result[page][1].includes(selectedAnswer)) {
          result[page][1] = result[page][1].filter((answer) => answer.index !== selectedAnswer.index);
          return result;
        }

        // reset and select
        result[page][1] = [selectedAnswer];
        return result;
      });
    }
  };

  return (
    <Container>
      <FlexBox>
        <PageIndicator total={questions.length + 1} current={page} />
        {!isLoading && questions[page] ? (
          <View style={{ flex: 1, width: 360 }}>
            <Title
              style={{
                marginTop: 16,
                paddingLeft: 12,
              }}
            >
              {questions[page].title}
            </Title>
            {questions[page].multiple && (
              <Subtitle
                style={{
                  marginTop: 24,
                  paddingLeft: 12,
                }}
              >
                Choose multiple options
              </Subtitle>
            )}
            <OptionsContainer>
              {answers[page] &&
                questions[page].options.map((option, i) => (
                  <Option
                    key={i}
                    option={option}
                    onClick={() => onclickOption(i)}
                    selected={answers[page][1].includes(option)}
                  />
                ))}
            </OptionsContainer>
            <PageBtnContainer>
              <Btn
                style={{
                  display: page === 0 ? "none" : "flex",
                  width: page === 0 ? "0%" : "50%",
                }}
                onPress={onClickPrev}
              >
                <BtnText>Back</BtnText>
              </Btn>
              <Btn
                style={{
                  flex: 1,
                  backgroundColor: isSelecting ? theme.colors.light.primary : "#fff",
                  borderColor: isSelecting ? "#fff" : "#A6A6A6",
                  borderWidth: isSelecting ? 0 : 1,
                  // width: page === 0 ? "100%" : "50%",
                }}
                onPress={onclickNext}
              >
                <BtnText
                  style={{
                    color: isSelecting ? "#fff" : "#A6A6A6",
                  }}
                >
                  Next
                </BtnText>
              </Btn>
            </PageBtnContainer>
            {mode.size > 1 && <CodeText>Code: {mode.code}</CodeText>}
          </View>
        ) : (
          !isLoading && <SpecialRequest answers={answers} category={categoryData.name} />
        )}
      </FlexBox>
    </Container>
  );
}
