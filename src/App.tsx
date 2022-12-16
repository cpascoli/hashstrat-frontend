import { useState } from "react";

import { DAppProvider, Goerli, Polygon, ChainId, Mainnet } from '@usedapp/core';

import { Container } from '@material-ui/core'
import { Main } from './components/Main'
import { getDefaultProvider } from 'ethers'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';


const App = () => {

	const darkMode = localStorage.getItem("darkMode") === "dark"
	const [toggleDark, setToggleDark] = useState(darkMode);


	const useDappConfig = {
		defaultNetwork: Polygon.chainId,
		// networks: [Goerli, Polygon],
		readOnlyChainId: Polygon.chainId,
		readOnlyUrls: {
			[Goerli.chainId]: getDefaultProvider('goerli'),
			[Polygon.chainId]: getDefaultProvider('matic'),
		},
		notifications: {
			expirationPeriod: 1000,
			checkInterval: 100,
		},
		// refresh: "everyBlock",
	};
	  

	const appTheme = createTheme({
		palette: {
			type: toggleDark ? "dark" : "light",
			primary: {
				main: toggleDark ? '#0091EA' : '#0091EA',
			},
			secondary: {
				main: toggleDark ? '#ffaf49' : '#4e3073',
			},
			info: {
				light: toggleDark ? '#222222' : '#4b5f6',
				main: toggleDark ? '#2196f3' : '#2196f3',
				dark: toggleDark ? '#1976d2' : '#1976d2',
			 },
			 background: {
				paper: toggleDark ? '#424242' : '#fff',
				default: toggleDark ? '#303030' : '#909090',
			 },
			 action: { 
				active: toggleDark ? '#E4821B' : '#1c7ec5',
			 }
		},	

	});

	appTheme.typography.h3 = {
		fontSize: '2.2rem',
		fontWeight: 400,
        [appTheme.breakpoints.down('sm')]: {
			fontSize: '1.8rem',
        },
	};

	appTheme.typography.h4 = {
		fontSize: '1.9rem',
		fontWeight: 400,
        [appTheme.breakpoints.down('sm')]: {
			fontSize: '1.6rem',
        },
	};

	appTheme.typography.h5 = {
		fontSize: '1.8em',
		fontWeight: 400,
        [appTheme.breakpoints.down('sm')]: {
			fontSize: '1.4rem',
        },
	};

	console.log("theme: ", appTheme)

	return (
		<ThemeProvider theme={{ ...appTheme }}>
			<DAppProvider config={useDappConfig}>
				<CssBaseline />
				<Container maxWidth="xl" disableGutters>
					<Main toggleDark={toggleDark} setToggleDark={setToggleDark} />
				</Container>
			</DAppProvider>
		</ThemeProvider>
	)
}

export default App;
