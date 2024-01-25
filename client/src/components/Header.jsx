import styled from "styled-components";
import MobileTopIcons from "./MobileTopIcons";

const Container = styled.header`
  position: sticky;
  top: 0;
  background-color: transparent;
`;

export default function Header() {
  return (
    <Container>
      <MobileTopIcons />
    </Container>
  );
}
