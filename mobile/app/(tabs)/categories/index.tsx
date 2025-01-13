import { Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { questionsByCategory } from "@/data/questions";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";

const Container = styled(View)`
  flex: 1;
  width: 360px;
  margin: 0 auto;
  background-color: ${(props) => props.theme.colors.light.background};
`;

const Title = styled(View)`
  width: 100%;
  margin-bottom: 20px;
  padding-left: 12px;
  font-size: ${(props) => props.theme.fontSize.large};
  font-family: ${(props) => props.theme.fonts.bold};
`;

const Subtitle = styled(View)`
  width: 100%;
  padding-left: 12px;
  margin-bottom: 32px;
  line-height: 48px;
  font-size: ${(props) => props.theme.fontSize.small};
  font-family: ${(props) => props.theme.fonts.medium};
`;

const Box = styled(TouchableOpacity)`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  margin-bottom: 24px;
  border: 1px solid;
  border-radius: 16px;
  box-shadow: 1px 2px 5px lightgray;
  font-size: ${(props) => props.theme.fontSize.small};
  font-family: ${(props) => props.theme.fonts.medium};

  svg {
    position: absolute;
    right: 24px;
    height: 24px;
  }
`;

interface Props {
  type: number;
}

export default function Categories() {
  const navigation = useNavigation();
  console.log(navigation.getId());

  const onclick = (category) => {
    console.log(category);
  };

  return (
    <Container>
      <Title>Categories</Title>
      <Subtitle>What kind of experience are you looking to decide?</Subtitle>
      {questionsByCategory.map((category) => (
        <Box
          key={category.name}
          style={{ borderColor: category.theme }}
          opPress={() => onclick(category.name)}
        >
          {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
        </Box>
      ))}
    </Container>
  );
}
