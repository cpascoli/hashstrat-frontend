import { useState, useEffect } from 'react';

import { useEthers, Polygon, shortenAddress } from "@usedapp/core";
import { styled } from "@material-ui/core/styles"

import { useTheme, Button, Link, Menu, MenuProps, MenuItem, Divider, Typography, makeStyles, Box, Switch } from "@material-ui/core"
import { Menu as MenuIcon, KeyboardArrowDown, KeyboardArrowUp, WbSunny, Brightness3 } from "@material-ui/icons"


import { Alert, AlertTitle } from "@material-ui/lab"
import { useLocation, Link as RouterLink } from "react-router-dom"
import { StyledAlert } from "./shared/StyledAlert"
import { NetworkName } from "../utils/network"
import { Horizontal } from './Layout';

import { ConnectButton } from "../main/ConnectButton"
import homeLight from "./img/home-light.svg"
import homeDark from "./img/home-dark.svg"


const StyledMenu = styled((props: MenuProps) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'left',
		}}
		{...props}
	/>
))(({ theme }) => ({
	// '& .MuiPaper-root': {
	borderRadius: 8,
	marginTop: theme.spacing(1),
	minWidth: 200,
	color: theme.palette.type === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
	boxShadow:
		'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
	'& .MuiMenu-list': {
		padding: '4px 0',
	},
	// },
}));


const useStyles = makeStyles(theme => ({
	container: {
		// backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
		display: "flex",
		justifyContent: "space-between",
		borderRadius: 0,
		padding: 0,
		margin: 0,
		boxShadow: `0px 2px 0px ${theme.palette.secondary.main}`, /* offset-x | offset-y | blur-radius | color */
		alignContent: "middle",
	},

	menu: {
        // border: `2px solid ${theme.palette.secondary.main}`,
		borderRadius: 10,
	},

	menuItems: {
		display: "flex",
		justifyContent: "space-around",
		flexDirection: "row",
		flexFlow: "row wrap",
		alignItems: "center",
		gap: theme.spacing(2),

		[theme.breakpoints.down('xs')]: {
			display: "none"
		},
	},

	darkModeSwitch: {
		display: 'flex',
		alignItems: 'center',
	},

	rightItmesContainer: {
		paddingTop: theme.spacing(2),
		paddingRight: theme.spacing(2),
		paddingBottom: theme.spacing(2),

		display: "flex",
		justifyContent: "flex-end",
		gap: theme.spacing(2),
	},
	
	logoFilter: {
		filter: "invert(20%)"
	}
}))




export interface ConnectedInfo {
	chainId: number | undefined,
	account: string | undefined
}

interface HeaderProps {
	toggleDark: boolean,
	setToggleDark: (arg0: boolean) => void,

	setAccount: React.Dispatch<React.SetStateAction<string | undefined>>,
	setChainId: React.Dispatch<React.SetStateAction<number | undefined>>,

	wrongNetworkHandler: (chainId: number) => void,
}


export const Header = ({ toggleDark, setToggleDark, setAccount, setChainId, wrongNetworkHandler }: HeaderProps) => {

	const classes = useStyles()
	const theme = useTheme();
	const lightMode = theme.palette.type === 'light'
	const logImg = lightMode ? homeLight : homeDark


	const [networkName, setNetworkName] = useState<string>("")

	const handleModeChange = () => {
		localStorage.setItem("darkMode", toggleDark ? 'light' : 'dark');
		setToggleDark(!toggleDark);
	};

	// watch the network name to show the user the real network connected
	const { account, deactivate, chainId } = useEthers()

	useEffect(() => {
		setAccount(account)
		if (chainId) {
			const network = NetworkName(chainId) ?? "Unknown"
			setNetworkName(network)
			wrongNetworkHandler(chainId)
		}
	
	}, [chainId, account])
	

	// manage menu
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const [menuOpen, setMenuOpen] = useState(false)

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		setMenuOpen(true)
	};
	const handleClose = () => {
		setAnchorEl(null);
		setMenuOpen(false)
	};

	const disconnectPressed = () => {
		deactivate()
		console.log("disconnected!")
		window.location.reload()
	}


	const shortAccount = account ? shortenAddress(account) : ''
	const theLocation = useLocation();
	const isHome = theLocation.pathname === '/home'
	const isRoot = theLocation.pathname === '/'
	const isConnected = account !== undefined


	return (

		<header>

			<Box className={classes.container}>

				<Link component={RouterLink} to="/" >
					<Button> <img src={logImg} style={{ width: 55, height: 55 }} className={classes.logoFilter} /> </Button>
				</Link>
				
				<div className={classes.rightItmesContainer}>

					{isRoot && 
						<div className={classes.darkModeSwitch} >
							{ !lightMode &&  <Brightness3 color='primary' onClick={handleModeChange} /> }
							{ lightMode &&   <WbSunny color='primary' onClick={handleModeChange} /> }
						</div>
					}

					{ isConnected && !isRoot &&
						<div>
							
							<Button className={classes.menu}
								id="account-button"
								// aria-controls={open ? 'account-menu' : undefined}
								// aria-haspopup="true"
								// aria-expanded={open ? 'true' : undefined}
								variant="outlined"
								color='secondary'
								disableElevation
								onClick={handleClick}
								endIcon={ menuOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown /> }
							>
								
								{ isConnected ? shortAccount :
									<MenuIcon />}
							</Button>

							<StyledMenu
								id="account-menu"
								anchorEl={anchorEl}
								getContentAnchorEl={null}
								open={open}
								onClose={handleClose}
							>
									
								<nav>
									
									<Link component={RouterLink} to="/dao">
										<MenuItem onClick={handleClose}> DAO </MenuItem>
									</Link>
									
									<Link component={RouterLink} to="/invest">
										<MenuItem onClick={handleClose}> Invest </MenuItem>
									</Link>

									<Link component={RouterLink} to="/strategies">
										<MenuItem onClick={handleClose}>Strategies</MenuItem>
									</Link>

									<Link href="https://medium.com/@hashstrat" target="_blank">
										<MenuItem onClick={handleClose}>Blog</MenuItem>
									</Link>
									
									<Link href="./whitepaper.pdf" target="_blank">
										<MenuItem onClick={handleClose}>Whitepaper</MenuItem>
									</Link>



									<Divider />

									<MenuItem onClick={handleClose}>
										<span style={{minWidth: 110}}> { lightMode ?  'Dark' : 'Light' } mode </span>

										<Switch
											checked={toggleDark}
											onChange={handleModeChange}
											name="toggleDark"
											color="default"
										/>
										{ lightMode && <Brightness3 color='primary'/> }
										{ !lightMode && <WbSunny color='primary'/> }
									</MenuItem>
								</nav>


								{isConnected &&
									<div>
										<Divider />
										<MenuItem onClick={handleClose}>
											<Typography variant='body1'> Connected to {networkName.toUpperCase()} </Typography>
										</MenuItem>
										<MenuItem onClick={handleClose} >
											<Button color="primary" variant="contained" onClick={disconnectPressed} fullWidth >Disconnect</Button>
										</MenuItem>
									</div>
								}
								{!isConnected && isHome &&
									<div>
										<MenuItem onClick={handleClose}>
											<ConnectButton />
										</MenuItem>
									</div>
								}

							</StyledMenu>
						</div>
					}
					

				</div> 
					
			</Box>

		</header>
	)
}