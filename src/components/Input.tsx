import { styled } from 'styled-components';
import { MdOutlineCancel } from 'react-icons/md';
import useInput from '../hooks/useInput';
export default function Input({ onFocus, onBlur }: { onFocus: () => void; onBlur: () => void }) {
  const { inputValue, setInput } = useInput();

  return (
    <Wrapper>
      <S_Input
        onFocus={onFocus}
        onBlur={() => {
          onBlur();
          setInput('');
        }}
        type='text'
        autoFocus
        value={inputValue}
        onChange={(e) => setInput(e.target.value)}
      />
      <MdOutlineCancel size='1.75rem' fill='#aaaaaa' />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 85%;

  > svg {
    cursor: pointer;
  }
`;

const S_Input = styled.input`
  font-size: 1.25rem;
  line-height: 1.5;
  width: 100%;
`;
