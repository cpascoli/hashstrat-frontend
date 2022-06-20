
import { makeStyles } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"
import { Token } from  "../Main"
import { ContentTabs } from "./ContentTabs"


interface ContentPanelProps {
    chainId: number,
    account: string,
    tokens: Array<Token>
}

// const useStyle = makeStyles( theme => ({
//     container: {
//         margin: "auto",
//         padding: 20,
//     },
//     portfolioInfo: {
//         maxWidth: 640,
//         margin: "auto"
//     }
// }))



export const ContentPanel = ( { chainId, account, tokens } : ContentPanelProps) => {

    console.log(">>> ContentPanel () = chainId: ", chainId, account, tokens)

    return (
        <div>

            { (!chainId && account) &&
                <Alert severity="warning" style={{textAlign: "center"}}> 
                    <AlertTitle>Wrong Network</AlertTitle>
                    Please connect an account to the <strong>Polygon</strong> or <strong>Kovan</strong> networks to use the dapp!
                </Alert>
            }

            { (!chainId || !account) &&
                <Alert severity="info" style={{textAlign: "center"}}> 
                    <AlertTitle>No account connected</AlertTitle>
                    Please connect an account to the Polygon or Kovan networks to use the dapp!
                </Alert>
            }
            
            <ContentTabs chainId={chainId} account={account} tokens={tokens} />

        </div>
    )


}