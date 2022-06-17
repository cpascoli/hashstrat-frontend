import Switch from "@material-ui/core/Switch";
import { useEthers } from "@usedapp/core";
import { Button, makeStyles } from "@material-ui/core"


const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1),
        border: "1px solid black",
    }
}))


// toggleDark={toggleDark} settoggleDark={settoggleDark}

interface HeaderProps {
    toggleDark: boolean,
    setToggleDark: (arg0: boolean) => void

}


export const Header = ( { toggleDark, setToggleDark } : HeaderProps ) => {

    const classes = useStyles()

    const handleModeChange = () => {
        setToggleDark(!toggleDark);
        console.log("handleModeChange: ", typeof toggleDark, !toggleDark)
    };

    const { account, activateBrowserWallet, deactivate }  = useEthers()
    const isConnected = account !== undefined
    console.log("Connected account ", account)

    return (
        <div className={classes.container}>
            <div>

                <Switch
                    checked={toggleDark}
                    onChange={handleModeChange}
                    name="toggleDark"
                    color="default"
                />

                { isConnected ? 
                    (<Button color="primary" variant="contained" onClick={deactivate}>Disconnect</Button>)
                    :
                    (<Button color="primary" variant="contained" onClick={() => activateBrowserWallet() }>Connect</Button>)
                }

            </div>
        </div>
    )
}