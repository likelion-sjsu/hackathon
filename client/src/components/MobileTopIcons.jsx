import styled from "styled-components";
import { WifiIcon, Battery50Icon } from "@heroicons/react/24/outline";
import { FaSignal } from "react-icons/fa";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 20px;
`;

const Clock = styled.div`
  font-size: 15px;
`;

const RightIconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export default function MobileTopIcons() {
  return (
    <Container>
      <Clock>19:41</Clock>
      <RightIconGroup>
        <FaSignal size="20" />
        <WifiIcon width={20} strokeWidth={2} />
        <Battery50Icon height={24} strokeWidth={1.5} />
      </RightIconGroup>
    </Container>
  );
}
