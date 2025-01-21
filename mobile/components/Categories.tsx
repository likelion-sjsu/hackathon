import { Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useRouter } from "expo-router";
import { useRecoilState } from "recoil";
import { modeAtom } from "@/utils/atoms";
import { getCategoryList, SERVER_URL } from "@/utils/api";
import { Container, Subtitle, Title } from "@/styles/GlobalStyle";
import { useQuery } from "react-query";

const Box = styled(TouchableOpacity)`
  justify-content: center;
  align-items: center;
  width: 360px;
  height: 80px;
  margin-bottom: 24px;
  border: 1px solid;
  border-radius: 16px;
  box-shadow: 1px 2px 5px lightgray;

  svg {
    position: absolute;
    right: 24px;
    height: 24px;
  }
`;

const CategoryText = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.medium};
  font-family: ${(props) => props.theme.fonts.medium};
`;

export default function Categories() {
  const { push } = useRouter();
  const [mode, setMode] = useRecoilState(modeAtom);
  const { data, isLoading } = useQuery(["categories"], { queryFn: getCategoryList });

  const onSelectCategory = async (categoryId: number) => {
    /* GROUP */
    if (![0, 1].includes(mode.size)) {
      const formData = new FormData();
      const roomSize = mode.size + "";
      formData.append("category_id", categoryId.toString());
      formData.append("max_count", roomSize);
      const res = await fetch(`${SERVER_URL}/room/`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log(res.status, data);
      setMode({ ...mode, code: data.code });
      push(`/created?cid=${categoryId}`);
    } else
    /* Solo */
      push(`/category/${categoryId}`);
  };

  return (
    <Container>
      <Title>Categories</Title>
      <Subtitle
        style={{
          marginBottom: 32,
        }}
      >
        What kind of experience are you looking to decide?
      </Subtitle>
      {!isLoading &&
        data.map(({ id, name, color }) => (
          <Box key={id} style={{ borderColor: color }} onPress={() => onSelectCategory(id)}>
            <CategoryText>{name.charAt(0).toUpperCase() + name.slice(1)}</CategoryText>
          </Box>
        ))}
    </Container>
  );
}
