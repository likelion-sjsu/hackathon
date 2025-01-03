import React, { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useQueries } from "react-query";
import { getPicture } from "api";

const Container = styled.main`
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const CenterBox = styled.div`
  position: relative;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 100px);
`;

const Title = styled.div`
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
  padding-left: 12px;
`;

const Box = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 60px;
  width: 360px;
  min-height: 80px;
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 3px 3px 4px rgba(204, 204, 204, 0.25);
  background-size: cover;

  div {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 40%);
    border-radius: 16px;
  }

  h1 {
    font-family: "'Fugaz One', sans-serif";
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
    width: 340px;
    color: white;
    z-index: 10;
  }
  p {
    color: white;
    z-index: 10;
  }
`;

// const ToMapBtn = styled(Link)`
//   display: grid;
//   place-content: center;
//   margin-top: 40px;
//   width: 360px;
//   min-height: 48px;
//   border-radius: 16px;
//   border: none;
//   outline: none;
//   background-color: ${(props) => props.theme.brandColor};
//   font-size: ${(props) => props.theme.fontBtn.fontSize};
//   font-weight: ${(props) => props.theme.fontBtn.fontWeight};
//   color: white;
//   cursor: pointer;
// `;

const ToHomeBtn = styled(Link)`
  display: grid;
  place-content: center;
  margin: 24px auto;
  width: 360px;
  min-height: 48px;
  border-radius: 16px;
  border: none;
  outline: 1px solid #eeeeee;
  font-size: ${(props) => props.theme.fontBtn.fontSize};
  font-weight: ${(props) => props.theme.fontBtn.fontWeight};
  cursor: pointer;
`;

const price_query = {
  whatever: "",
  "$0-$10": "1e0!",
  "$10-$25": "1e1!",
  "$25-$50": "1e2!",
  "$50 and up": "1e3!",
};

export default function Result() {
  const location = useLocation();
  const { results, query } = location.state;
  const boxRef = useRef(null);
  const queries = useQueries(
    results.map((query) => ({
      queryKey: ["picture", query],
      queryFn: () => getPicture(query),
    }))
  );

  const getMapUrl = (result) =>
    `https://www.google.com/maps/search/${result
      .replace(/ /g, "+")
      .replace(".", "")}+near+me/data=!3m1!4b1!4m4!2m3!5m1!${
      price_query[query.price]
    }6e5?entry=ttu`;

  const getPhotoURL = (i) => {
    return queries[i].data.photos[0].src.tiny;
  };

  return (
    <Container>
      <CenterBox>
        <Title>Results</Title>
        <div>
          {results.map((result, i) => (
            <Box
              ref={boxRef}
              style={{
                background:
                  queries[i].isSuccess &&
                  `url(${getPhotoURL(i)}) 50% 50% / cover`,
              }}
              to={getMapUrl(result)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div />
              <h1>{result}</h1>
            </Box>
          ))}
        </div>
        <ToHomeBtn to={"/"}>Go back to Home</ToHomeBtn>
      </CenterBox>
    </Container>
  );
}
