import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import FindInPageIcon from "@material-ui/icons/FindInPageOutlined";

const useStyles = makeStyles({
  root: {
    width: 250,
  },
  input: {
    width: 42,
  },
});

export default function InputSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(25);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    if (props.onChange) {
      props.onChange(newValue);
    }
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };


  const handleBlur = () => {
    if (value < 5) {
      setValue(5);
    } else if (value >= 500) {
      setValue(500);
    }
  };

  return (
    <div className={classes.root}>
      <Typography id="input-slider" gutterBottom>
        Number of Results
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <FindInPageIcon />
        </Grid>
        <Grid item xs>
          <Slider
            id="mySlider"
            value={typeof value === "number" ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 5,
              min: 5,
              max: 500,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
