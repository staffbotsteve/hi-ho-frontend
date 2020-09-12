import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import API from "../../utils/API";
import SubmitBtn from "../SubmitBtn";
import Help from "../Help"

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function APIInput() {
  const classes = useStyles();

  const [location, setLocation] = useState("");
  const [range, setRange] = useState("");
  const [job, setJob] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    API.zipRecruiter(job, location, range).then((res) =>
      console.log("ziprecruiter", res)
    );

    API.ItemPrices(location).then((res) => console.log("itemprices", res));

    API.CostOfLiving(location).then((res) => console.log("costofliving", res));
  };

  return (
    <div>
      <form className={classes.root} noValidate autoComplete="off" style={{display: "flex"}}>
      <TextField
        required
        id="outlined-required"
        label="Job Keyword"
        placeholder="ex. Engineer"
        variant="outlined"
        onChange={(e) => setJob(e.target.value)}
        value={job}
      />

      <TextField
        required
        id="outlined-required"
        label="Location"
        placeholder="ex. Berkeley"
        variant="outlined"
        onChange={(e) => setLocation(e.target.value)}
        value={location}
      />


      <TextField
        required
        id="outlined-required"
        label="Mile Radius"
        placeholder="ex. 25"
        variant="outlined"
        onChange={(e) => setRange(e.target.value)}
        value={range}
      />
      <Help />

    </form>
    
      <SubmitBtn handleSubmit={handleSubmit}>Submit</SubmitBtn>
    </div>
    
  );
}
