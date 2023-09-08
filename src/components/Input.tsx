import { styled } from 'styled-components';
import { MdOutlineCancel } from 'react-icons/md';
import useInput from '../hooks/useInput';
export default function Input({
  onFocus,
  onBlur,
  onArrowKeyPress,
}: {
  onFocus: () => void;
  onBlur: () => void;
  onArrowKeyPress: (e: React.KeyboardEvent<HTMLElement>) => void;
}) {
  const { inputValue, setInput } = useInput();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      onArrowKeyPress(e);
    }
  };

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
        onKeyDown={handleKeyDown}
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
