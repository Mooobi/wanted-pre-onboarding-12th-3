import { styled } from 'styled-components';
import { PLACEHOLDER_TEXT } from '../constants/constants';
import { AiOutlineSearch } from 'react-icons/ai';

export default function PlaceHolder({ onClick }: { onClick: () => void }) {
  return (
    <S_PlaceHolder onClick={onClick}>
      <AiOutlineSearch size='1.25rem' fill='#aaaaaa' className='icon' />
      {PLACEHOLDER_TEXT}
    </S_PlaceHolder>
  );
}

const S_PlaceHolder = styled.div`
  min-width: 85%;
  cursor: text;
  display: flex;
  align-items: center;
  color: #aaaaaa;

  .icon {
    margin-right: 0.5rem;
  }
`;
