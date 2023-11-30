import styled from 'styled-components'

export const LoadingSpinnerStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .loading-spinner {
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-top-color: #0078d4;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    margin-right: 5px;
    margin-left: 10px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

function LoadingSpinner() {
  return (
    <LoadingSpinnerStyled>
      <div className='loading-spinner'></div>
    </LoadingSpinnerStyled>
  )
}

export default LoadingSpinner
