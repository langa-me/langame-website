import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

// This is React component that displays a circular progress at
// the center of the screen on a backdrop.

const CenteredCircularProgress = () => {

    return (
        <Backdrop open={true}>
            <CircularProgress />
        </Backdrop>
    );
}

export default CenteredCircularProgress;
