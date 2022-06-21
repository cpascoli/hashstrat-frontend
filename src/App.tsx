import React, { useState } from "react";

import { DAppProvider, Kovan, Polygon } from '@usedapp/core';

import { Container } from '@material-ui/core'
import { Main } from './components/Main'
import { getDefaultProvider } from 'ethers'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';


function App() {

  const [toggleDark, setToggleDark] = useState(false);

  const appTheme = createTheme({
    palette: {
      type: toggleDark ? "dark" : "light",
    },
  });

  console.log("dark: ", toggleDark, appTheme)

  return (
      <ThemeProvider theme={{ ...appTheme }}>
       
        <DAppProvider config={{
            networks: [Kovan, Polygon],
            // readOnlyChainId: Kovan.chainId,
            readOnlyUrls: {
              [Kovan.chainId]: getDefaultProvider('kovan'),
              [Polygon.chainId]: getDefaultProvider('matic'),
            },
            notifications: {
              expirationPeriod: 1000,
              checkInterval: 100,
            },
        }}>
          
          <CssBaseline />
          <Container maxWidth="md" disableGutters>
              <Main toggleDark={toggleDark} setToggleDark={setToggleDark} />
          </Container>

        </DAppProvider>
      </ThemeProvider>
  );
}

export default App;
