import { useState } from "react";

import { DAppProvider, Kovan, Polygon } from '@usedapp/core';

import { Container } from '@material-ui/core'
import { Main } from './components/Main'
import { getDefaultProvider } from 'ethers'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';


 const App = () => {

  const darkMode = localStorage.getItem("darkMode") === "dark"
  const [toggleDark, setToggleDark] = useState(darkMode);


  const appTheme = createTheme({
    palette: {
      type: toggleDark ? "dark" : "light",
      primary: {
        main: toggleDark ?  '#0091EA' :  '#0091EA',
      },
      secondary: {
        main: toggleDark ?  '#ffaf49' :  '#ffaf49',
      }
    }
  });


  return (
      <ThemeProvider theme={{ ...appTheme }}>
        
        <DAppProvider config={{
            networks: [Kovan, Polygon],
            readOnlyChainId: Polygon.chainId,
            readOnlyUrls: {
              [Kovan.chainId]: getDefaultProvider('kovan'),
              [Polygon.chainId]: getDefaultProvider('matic'),
            },
            // pollingInterval
            notifications: {
              expirationPeriod: 1000,
              checkInterval: 100,
            },
            refresh: "everyBlock", //"everyBlock", // "never"| "everyBlock"
        }}>
          
          <CssBaseline />
          <Container maxWidth="md" disableGutters>
              <Main toggleDark={toggleDark} setToggleDark={setToggleDark} />
          </Container>
        </DAppProvider>
      </ThemeProvider>
    )
}

export default App;
