import { CustomAppBar } from "./CustomAppBar"
import { Offline, Online } from 'react-detect-offline'
import { Typography } from "@mui/material"


export const Debug = () => {
    return (
        <>
            <CustomAppBar />
            Hello World!
            You are <i><Online>online</Online><Offline>offline</Offline></i>
        </>
    )
}