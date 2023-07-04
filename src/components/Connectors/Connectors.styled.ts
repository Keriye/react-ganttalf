import styled from 'styled-components'

export const ConnectorsStyled = styled.svg`
  .c-connector-hovered path {
    stroke: ${({ theme }) => theme.themePrimary};
    stroke-width: 2;
  }
`
