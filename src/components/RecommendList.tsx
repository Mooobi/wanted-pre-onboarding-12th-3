import { AiOutlineSearch } from 'react-icons/ai';
import { NO_RECOMMENDED_SEARCH_TEXT } from '../constants/constants';
import useFetch from '../hooks/useFetch';
import useInput from '../hooks/useInput';
import { styled } from 'styled-components';

export default function RecommendList() {
  const { inputValue } = useInput();

  const { data, loading, error } = useFetch(inputValue);
  console.log(data, loading, error);

  if (!data) return NO_RECOMMENDED_SEARCH_TEXT;

  const slicedData = data.slice(0, 20);

  return (
    <Container>
      {slicedData.map((item) => (
        <Wrapper>
          <AiOutlineSearch size='1.25rem' fill='#aaaaaa' className='icon' />
          <TextFiled>{item.sickNm}</TextFiled>
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

const Wrapper = styled.li`
  cursor: pointer;
  display: flex;
  justify-content: start;
  align-items: center;
  color: #aaaaaa;
  line-height: 2;

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
