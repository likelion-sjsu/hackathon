import { Text, View } from "react-native";
import styled from "styled-components/native";

export const StyledView = styled(View)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.light.background};
  font-family: "Montserrat_400Regular";
`;

export const StyledText = styled(Text)`
  font-family: "Montserrat_400Regular";
  color: ${(props) => props.theme.colors.light.text};
`;
