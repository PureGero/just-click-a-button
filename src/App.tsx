import React from 'react';
import logo from './logo.svg';
import styled from 'styled-components';
import AppLogo from './AppLogo';
import ClickButton from './ClickButton';

const AppContainer = styled.div`
  text-align: center;
`;

const AppHeader = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

interface AppProps {
  
}

class App extends React.Component<AppProps> {
  render() {  
    return (
      <AppContainer>
        <AppHeader>
          <AppLogo src={logo} alt="logo" />
          <ClickButton />
        </AppHeader>
      </AppContainer>
    );
  }
}

export default App;
