import { styled } from 'styled-components';
import { RECOMMENDED_SEARCH_TEXT } from '../constants/constants';
import RecommendList from './RecommendList';

export default function AutoCompleteBox({ isFocused }: { isFocused: boolean }) {
  // const isCached = false;

  return (
    <Box $isFocused={isFocused}>
      <Wrapper>
        {RECOMMENDED_SEARCH_TEXT}
        <InnerWrapper>
          <RecommendList />
        </InnerWrapper>
      </Wrapper>
    </Box>
  );
}

const Box = styled.div.attrs<{ $isFocused: boolean }>(({ $isFocused }) => ({
  $isFocused: $isFocused,
}))`
  position: absolute;
  display: ${(props) => !props.$isFocused && 'none'};
  min-height: 15rem;
  width: 30rem;
  top: 25rem;
  border-radius: 1.25rem;
  background: white;
  box-shadow:
    -2px 0 4px rgba(50, 50, 50, 0.2),
    2px 2px 4px rgba(50, 50, 50, 0.2);
`;

const Wrapper = styled.section`
  padding: 1rem;
  min-height: 15rem;
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InnerWrapper = styled.div`
  font-size: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
`;
