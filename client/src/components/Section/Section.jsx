import styled from 'styled-components';
import {
  alignContent,
  alignItems,
  flex,
  flexDirection,
  flexWrap,
  justifyContent,
  space,
  width,
} from 'styled-system';

export default styled.div`
  ${space};
  ${width};
  ${flex};
  ${flexDirection};
  ${flexWrap};
  ${justifyContent};
  ${alignItems};
  ${alignContent};
  display: ${({ display }) => display || 'flex'};
  position: relative;
  overflow-y: ${({ overflowY }) => overflowY || 'initial'};
  overflow-x: ${({ overflowX }) => overflowX || 'initial'};
`;
