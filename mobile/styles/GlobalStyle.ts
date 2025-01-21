import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

const screenWidth = Dimensions.get("window").width;

export const StyledText = styled(Text)`
  font-family: "Montserrat_400Regular";
  color: ${(props) => props.theme.colors.light.text};
`;

export const Container = styled(View)`
  flex: 1;
  padding: 0 ${(screenWidth - 360) / 2}px;
  background-color: ${(props) => props.theme.colors.light.background};
`;

export const Title = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.large};
  font-family: ${(props) => props.theme.fonts.bold};
`;

export const Subtitle = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.small};
  font-family: ${(props) => props.theme.fonts.medium};
`;

export const BtnContainer = styled(View)`
  position: absolute;
  bottom: 120px;
`;

export const Btn = styled(TouchableOpacity)`
  width: 360px;
  min-height: 48px;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  background-color: ${(props) => props.theme.colors.light.primary};
  transition: 0.2s all;
  cursor: pointer;
`;

export const BtnText = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.smaller};
  font-family: ${(props) => props.theme.fonts.bold};
  color: #fff;
`;

export const BtnPlaceHolder = styled(TouchableOpacity)`
  width: 360px;
  min-height: 48px;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  border: 1px solid #a6a6a6;
  transition: 0.2s all;
  cursor: pointer;
`;
export const BtnPlaceHolderText = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.smaller};
  font-family: ${(props) => props.theme.fonts.bold};
  color: #fff;
  color: #a6a6a6;
`;

export const CodeText = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.smallest};
  font-family: ${(props) => props.theme.fonts.regular};
  color: ${(props) => props.theme.colors.light.gray};
  margin-top: 10px;
  padding-left: 4px;
`;
