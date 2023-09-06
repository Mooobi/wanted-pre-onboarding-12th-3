import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  line-height: 1.6;
}
a {
  text-decoration: none;
  color: inherit;
}
ul {
  list-style: none;
}
button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: none;
}
input, select, textarea {
  border: none;
  outline: none;
}
img {
  max-width: 100%;
  height: auto;
}
`;
