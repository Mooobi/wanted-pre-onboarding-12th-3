import { AiOutlineSearch } from 'react-icons/ai';
import { NO_RECOMMENDED_SEARCH_TEXT } from '../constants/constants';
import useFetch from '../hooks/useFetch';
import useInput from '../hooks/useInput';
import { styled } from 'styled-components';

export default function RecommendList({ currentIndex }: { currentIndex: number }) {
  const { inputValue } = useInput();

  const { data, loading } = useFetch(inputValue);

  if (loading) return <Container>Loading...</Container>;

  if (!data || !data.length) return NO_RECOMMENDED_SEARCH_TEXT;

  const slicedData = data.slice(0, 20);

  return (
    <Container>
      {slicedData.map((item, index) => (
        <Wrapper key={item.sickCd} $isFocus={index === currentIndex}>
          <AiOutlineSearch size='1.25rem' fill='#aaaaaa' className='icon' />
          <TextFiled>{item.sickNm}</TextFiled>
          {index}
        </Wrapper>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  :hover {
    background: #eeeeee;
  }
`;

const Wrapper = styled.li<{ $isFocus: boolean }>`
  cursor: pointer;
  display: flex;
  justify-content: start;
  align-items: center;
  color: #aaaaaa;
  line-height: 2;
  background: ${(props) => (props.$isFocus ? '#eeeeee' : 'inherit')};
  .icon {
    min-width: 1.25rem;
    margin-right: 0.5rem;
  }
`;

const TextFiled = styled.div`
  text-align: start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
