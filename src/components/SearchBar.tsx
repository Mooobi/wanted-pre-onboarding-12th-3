import { styled } from 'styled-components';
import Button from './Button';
import { useState } from 'react';
import Input from './Input';
import PlaceHolder from './PlaceHolder';
import AutoCompleteBox from './AutoCompleteBox';

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);

  const borderOn = () => {
    setIsFocused(true);
  };

  const borderOff = () => {
    setIsFocused(false);
  };

  return (
    <>
      <Wrapper $isFocused={isFocused}>
        {isFocused ? (
          <Input onFocus={borderOn} onBlur={borderOff} isFocused={isFocused} />
        ) : (
          <PlaceHolder onClick={borderOn} />
        )}
        <Button />
      </Wrapper>
      <AutoCompleteBox isFocused={isFocused} />
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
