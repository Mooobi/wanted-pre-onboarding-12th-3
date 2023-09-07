import { styled } from 'styled-components';
import { TITLE_TEXT_1, TITLE_TEXT_2 } from '../constants/constants';
import SearchBar from '../components/SearchBar';
import { InputProvider } from '../context/inputContext';

export default function Home() {
  return (
    <Wrapper>
      <Title>
        {TITLE_TEXT_1}
        <br />
        {TITLE_TEXT_2}
      </Title>
      <InputProvider>
        <SearchBar />
      </InputProvider>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  height: 40rem;
  width: 40rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 2rem;
`;

const Title = styled.h1`
  color: black;
  text-align: center;
`;
