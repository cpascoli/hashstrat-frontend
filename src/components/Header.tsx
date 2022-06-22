import { useState, useEffect } from 'react';

import { useBlockNumber } from "@usedapp/core"
import Switch from "@material-ui/core/Switch";
import { useEthers } from "@usedapp/core";
import { Button, makeStyles, Menu, MenuProps, MenuItem, Divider } from  "@material-ui/core"
import { styled, alpha} from "@material-ui/core/styles"
import { NetworkName } from "../utils/network"


import { Check, KeyboardArrowDown } from "@material-ui/icons"
import { shortenAccount } from "../utils/formatter"

const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
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
        padding: theme.spacing(2),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(4),
        borderRadius: 0,
        boxShadow: `0px 2px 0px  ${theme.palette.type == 'light' ? 'lightgrey': 'red'}`, /* offset-x | offset-y | blur-radius | color */
    }
}))

export interface ConnectedInfo {
  chainId: number | undefined,
  account: string | undefined
}

interface HeaderProps {
    toggleDark: boolean,
    setToggleDark: (arg0: boolean) => void
    setChainId: (chainId: number | undefined) => void
    setAccount: (arg0: string | undefined) => void
    // updateConnected: (chainId: number, account: string) => void
}


export const Header = ( { toggleDark, setToggleDark, setChainId, setAccount } : HeaderProps ) => {

    const classes = useStyles()

    const [networkName, setNetworkName] = useState<string>("")

    const blockNumber = useBlockNumber()


    const handleModeChange = () => {
        setToggleDark(!toggleDark);
        console.log("handleModeChange: ", typeof toggleDark, !toggleDark)
    };

    const { account, activateBrowserWallet, deactivate, chainId }  = useEthers()

    useEffect(() => {
      if (chainId) {
        setChainId(chainId)
        setNetworkName( NetworkName(chainId) )
      }
      if (account) {
        setAccount(account)
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

    const shortAccount = shortenAccount(account)
    
    return (
        <div className={classes.container}>
      
                <Switch
                    checked={toggleDark}
                    onChange={handleModeChange}
                    name="toggleDark"
                    color="default"
                />

                { isConnected ? 
                    (
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
                          {shortAccount}

                        </Button>

                        <StyledMenu
                          id="account-menu"
                          anchorEl={anchorEl}
                          getContentAnchorEl={null}
                          open={open}
                          onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>
                                Connectde to: {networkName}
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                Currnet Block: {blockNumber}
                            </MenuItem>

                            <Divider />

                            <MenuItem onClick={handleClose} >
                                <Button color="secondary" variant="outlined" onClick={disconnectPressed}>Disconnect</Button>
                            </MenuItem>
                        </StyledMenu>
                      </div>

                    )
                    :
                    (<Button color="primary" variant="contained" onClick={() => activateBrowserWallet() }>Connect</Button>)
                }

        </div>
    )
}