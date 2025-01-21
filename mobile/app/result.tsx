import { Link, useLocalSearchParams } from "expo-router";
import { ImageBackground, Linking, Text, TouchableOpacity, View } from "react-native";
import { useQueries } from "react-query";
import styled from "styled-components";
import { BtnContainer, BtnText, Container, Title } from "@/styles/GlobalStyle";
import { getPicture } from "@/utils/api";

const ResultsContainer = styled(View)`
  flex: 1;
  margin-top: 24px;
  gap: 24px;
`;

const ImageContainer = styled(ImageBackground)`
  width: 360px;
  height: 80px;
  border-radius: 16px;
  overflow: hidden;
`;

const OverlayBtn = styled(TouchableOpacity)`
  justify-content: center;
  align-items: center;
  height: 80px;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ResultText = styled(Text)`
  color: ${(props) => props.theme.colors.light.white};
  font-size: ${(props) => props.theme.fontSize.small};
  font-family: ${(props) => props.theme.fonts.bold};
`;

const ToHomeBtn = styled(Link)`
  margin-top: 40px;
  width: 360px;
  padding: 12px 0;
  border-radius: 16px;
  border: 1px solid #a6a6a6;
`;

const ToHomeBtnText = styled(BtnText)`
  color: ${(props) => props.theme.colors.light.gray};
  font-size: ${(props) => props.theme.fontSize.smaller};
  font-family: ${(props) => props.theme.fonts.bold};
  text-align: center;
`;

type PictureData = {
  photos: { src: { medium: string } }[];
};

export default function Result() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const results = data ? JSON.parse(data) : [];

  const pictures = useQueries(
    results.map((query) => ({
      queryKey: ["picture", query],
      queryFn: () => getPicture(query),
    }))
  );

  function getPhotoURL(i: number): string {
    const data = pictures[i].data as PictureData;
    return data.photos
      ? data.photos[0]?.src?.medium || "https://via.placeholder.com/360x80"
      : "https://via.placeholder.com/360x80";
  }

  function getMapUrl(result: string) {
    return `https://www.google.com/maps/search/${encodeURIComponent(result)}/data=!3m1!4b1!4m4!2m3!5m1!$6e5?entry=ttu`;
  }

  return (
    <Container>
      <Title>Results</Title>
      <ResultsContainer>
        {results.map((result, i) => (
          <ImageContainer
            key={i}
            source={{ uri: pictures[i].isSuccess ? getPhotoURL(i) : "https://via.placeholder.com/360x80" }}
          >
            <OverlayBtn onPress={() => Linking.openURL(getMapUrl(result))}>
              <ResultText style={{ color: "white" }}>{result}</ResultText>
            </OverlayBtn>
          </ImageContainer>
        ))}
        <BtnContainer>
          <ToHomeBtn href={"/"}>
            <ToHomeBtnText>Go back to Home</ToHomeBtnText>
          </ToHomeBtn>
        </BtnContainer>
      </ResultsContainer>
    </Container>
  );
}
