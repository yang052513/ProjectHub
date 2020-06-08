import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import CircularProgress from "@material-ui/core/CircularProgress"

// Source code from Material UI
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}))

export default function CircularIndeterminate() {
  const classes = useStyles()

  return (
    <div className="progress-container">
      <div className={classes.root}>
        <CircularProgress />
      </div>
    </div>
  )
}
