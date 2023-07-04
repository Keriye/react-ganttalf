import styled from 'styled-components'

const GanttChartStyled = styled.div`
  text-align: left;
  line-height: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  max-height: 100%;
  width: 100%;
  color: #323130;

  * {
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
      'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  .ganttalf__body-wrapper {
    width: 100%;
    /* height: 'calc(100% - 50px)',
    position: 'absolute', */
    height: 100%;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    overflow: hidden;
  }

  .ganttalf__body {
    width: 100%;
    max-height: 100%;
    position: relative;
    overflow: auto;
    border-bottom: 1px solid #edebe9;
    height: 100%;
  }
`

export default GanttChartStyled
