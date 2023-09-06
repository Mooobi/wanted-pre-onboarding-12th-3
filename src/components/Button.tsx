import { styled } from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';

export default function Button() {
  return (
    <S_Button>
      <AiOutlineSearch size='1.75rem' fill='white' />
    </S_Button>
  );
}

const S_Button = styled.button`
  margin: 0.5rem;
  border-radius: 50%;
  background: #007be9;
  height: 3rem;
  width: 3rem;

  > svg {
  }
`;
