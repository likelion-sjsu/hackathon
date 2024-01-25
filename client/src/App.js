import React from "react";
import { createGlobalStyle } from "styled-components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import TabBar from "./components/TabBar";
import Header from "./components/Header";
import SelectMode from "Routes/SelectMode";
import SelectCategory from "Routes/SelectCategory";
import Result from "Routes/Result";
import Questions from "Routes/Questions";
import StandBy from "Routes/StandBy";

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mode" element={<SelectMode />} />
          <Route path="/category" element={<SelectCategory />} />
          <Route path="/category/:category" element={<Questions />} />
          <Route path="/result" element={<Result />} />
          <Route path="/standby" element={<StandBy />} />
        </Routes>
        <TabBar />
      </BrowserRouter>
    </>
  );
}

const GlobalStyle = createGlobalStyle`
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
}
body {
  font-family: 'Montserrat', sans-serif;
  background-color: #fff;
  color: ${(props) => props.theme.mainFont};
  overflow: hidden;
}
a {
  text-decoration:none;
  color: inherit;
}
h1 {
  font-size: ${(props) => props.theme.fontTitle.fontSize};
  font-weight: ${(props) => props.theme.fontTitle.fontWeight};
  margin: 0px;
}
p {
  font-size: ${(props) => props.theme.fontBody.fontSize};
  font-weight: ${(props) => props.theme.fontBody.fontWeight}
}
`;

export default App;
