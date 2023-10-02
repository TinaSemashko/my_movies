import { styled } from "@mui/material/styles";
import img from "./images/pexels-tima-miroshnichenko-7991303.jpg";

export const MainContainer = styled("div")`
  background-image: url(${img});
  background-size: cover;
  width: 100%;
  min-height: 100vh;
  color: white;
`;

export const ContainerList = styled("div")`
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: auto;
`;

export const List = styled("div")`
  grid-column: 1;
  cursor: pointer;
`;

export const Details = styled("div")`
  grid-column: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
