import { Box, Divider, Grid, Stack, Typography } from "@mui/material"
import { Container } from "@mui/system"

export const NotFoundPage = () => {

    return (
        <Box 
            minHeight="100vh"
            alignContent={"center"}
            justifyContent={"center"}
            alignItems={"center"}
            display={"flex"}
            flexDirection={"column"}
            >
        <Divider style={{width:'70%'}} >
            <Typography variant="h1">404</Typography>
        </Divider>
        <Typography variant="h4">Page not found</Typography>
        </Box>
    )

}
