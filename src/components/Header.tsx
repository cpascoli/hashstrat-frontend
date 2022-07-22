import { useState, useEffect } from 'react';
import { useBlockNumber, shortenAddress } from "@usedapp/core"
import Switch from "@material-ui/core/Switch";
import { useEthers } from "@usedapp/core";
import { Button, Link, Menu, MenuProps, MenuItem, Divider, Typography, makeStyles } from  "@material-ui/core"
import { styled } from "@material-ui/core/styles"
import { NetworkName } from "../utils/network"
import { KeyboardArrowDown } from "@material-ui/icons"
import { Link as RouterLink } from "react-router-dom"
import { Horizontal } from './Layout';
import home from "./img/home.png"


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
      '& .MuiPaper-root': {
        borderRadius: 8,
        marginTop: theme.spacing(1),
        minWidth: 200,
        color: theme.palette.type === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
          'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
          padding: '4px 0',
        },
      },
}));

const useStyles = makeStyles( theme => ({
  container: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    display: "flex",
    justifyContent: "space-between",
    borderRadius: 0,
    padding: 0,
    margin: 0,
    boxShadow: `0px 2px 0px ${theme.palette.secondary.main}`, /* offset-x | offset-y | blur-radius | color */
    alignContent: "middle",
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
  menuItemsSmall: {
    [theme.breakpoints.up('sm')]: {
      display: "none"
    },
  },
  rightItmesContainer: {
      padding: theme.spacing(2),
      display: "flex",
      justifyContent: "flex-end",
      gap: theme.spacing(4),

    }
}))




export interface ConnectedInfo {
  chainId: number | undefined,
  account: string | undefined
}

interface HeaderProps {
    toggleDark: boolean,
    setToggleDark: (arg0: boolean) => void
}


export const Header = ( { toggleDark, setToggleDark } : HeaderProps ) => {

    const classes = useStyles()

    const [networkName, setNetworkName] = useState<string>("")

    const blockNumber = useBlockNumber()


    const handleModeChange = () => {
      localStorage.setItem("darkMode", toggleDark ? 'light' : 'dark');
      setToggleDark(!toggleDark);
    };

    const { account, deactivate, chainId }  = useEthers()

    useEffect(() => {
      if (chainId) {
        setNetworkName( NetworkName(chainId) )
      }
    }, [chainId, account])


    const isConnected = account !== undefined

    // manage menu
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const disconnectPressed = () => {
      deactivate()
      console.log("disconnected!")
      window.location.reload()
    }

    const shortAccount = account ? shortenAddress(account) : ''
    
    return (
        <div className={classes.container}>

          <a href="/" style={{ textDecoration: 'none'}} > 
            <Button> <img src={home} style={{width: 55, height: 55}} /> </Button>
          </a>

          <div className={classes.menuItems}>      
              <Link component={RouterLink} to="/pools">Pools</Link>
              <Link component={RouterLink} to="/strategies">Strategies</Link>
              <Link component={RouterLink} to="/faq">FAQ</Link>
          </div>
        
          <div className={classes.rightItmesContainer}>
                  <div>
                      <Button
                        id="account-button"
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        variant="contained"
                        disableElevation
                        onClick={handleClick}
                        endIcon={<KeyboardArrowDown />}
                      >
                        {isConnected ? shortAccount : "Menu"}
                      </Button>

                      <StyledMenu
                        id="account-menu"
                        anchorEl={anchorEl}
                        getContentAnchorEl={null}
                        open={open}
                        onClose={handleClose}
                      >

                        <div  className={classes.menuItemsSmall} > 
                            <MenuItem onClick={handleClose}>
                                <Link component={RouterLink} to="/pools">Pools</Link>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Link component={RouterLink} to="/strategies">Strategies</Link>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Link component={RouterLink} to="/faq">FAQ</Link>
                            </MenuItem>

                            <Divider />
                        </div>

                        <MenuItem onClick={handleClose}>
                           <Horizontal valign='center'>
                              <Typography>
                                 { toggleDark ? "Light Mode" : "Dark Mode" }
                              </Typography>
                              <Switch
                                  checked={toggleDark}
                                  onChange={handleModeChange}
                                  name="toggleDark"
                                  color="default"
                              />
                              </Horizontal>
                        </MenuItem>

                        {isConnected &&
                          <div>
                              <Divider />
                              <MenuItem onClick={handleClose}>
                                  <Typography variant='body2'> Connected to {networkName.toUpperCase()} </Typography>
                              </MenuItem>
                              <MenuItem onClick={handleClose} >
                                  <Button color="secondary" variant="contained" onClick={disconnectPressed}>Disconnect</Button>
                              </MenuItem>
                          </div>
                        }
         
                      </StyledMenu>
                    </div>

          </div>

      </div>
    )
}