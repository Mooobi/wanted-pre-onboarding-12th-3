import { styled } from 'styled-components';
import Button from './Button';
import { useState } from 'react';
import Input from './Input';
import PlaceHolder from './PlaceHolder';
import AutoCompleteBox from './AutoCompleteBox';

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(-1);

  const borderOn = () => {
    setIsFocused(true);
  };

  const borderOff = () => {
    setIsFocused(false);
    setCurrentIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowDown' && currentIndex < 20) {
      setCurrentIndex(currentIndex + 1);
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <>
      <Wrapper $isFocused={isFocused}>
        {isFocused ? (
          <Input onFocus={borderOn} onBlur={borderOff} onArrowKeyPress={handleKeyDown} />
        ) : (
          <PlaceHolder onClick={borderOn} />
        )}
        <Button />
      </Wrapper>
      <AutoCompleteBox isFocused={isFocused} currentIndex={currentIndex} />
    </>
  );
}

const Wrapper = styled.div.attrs<{ $isFocused: boolean }>(({ $isFocused }) => ({
  $isFocused: $isFocused,
}))`
  position: relative;
  padding-left: 2rem;
  width: 30rem;
  border-radius: 4rem;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: ${(props) => (props.$isFocused ? '2px solid #007be9' : '2px solid white')};
`;
