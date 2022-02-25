import styled from 'styled-components'

import { pxToRem } from '../../utils'

export const SField = styled.div<{
  invalid?: boolean
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ invalid }) => invalid
    && `
    & label {
      color: red;
      opacity: 1;
    }
  `}
`
export const SLabel = styled.label`
  font-size: ${pxToRem(12)}rem;
  opacity: 0.5;
  margin-bottom: ${pxToRem(8)}rem;
`
