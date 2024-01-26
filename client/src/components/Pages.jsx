import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  gap: 10px;
`;

const Bar = styled(motion.div)`
  width: 40px;
  height: 8px;
  background-color: ${(props) => props.theme.brandColor};
  border-radius: 4px;
`;

const Dot = styled(motion.div)`
  width: 8px;
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
`;

export default function Pages({ total, current }) {
  return (
    <Container>
      {Array.from({ length: total }).map((_, index) =>
        index === current - 1 ? (
          <Bar layoutId="bar" key={index} />
        ) : (
          <Dot key={index} />
        )
      )}
    </Container>
  );
}
