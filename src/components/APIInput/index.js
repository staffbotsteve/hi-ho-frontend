import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import API from '../../utils/API'
import SubmitBtn from '../SubmitBtn'


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function APIInput() {
  const classes = useStyles();

  const [location, setLocation] = useState("");
  const [range, setRange] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    API.zipRecruiter(location, range)
      .then(res => console.log("ziprecruiter", res))

     API.ItemPrices(location)
    .then(res => console.log("itemprices", res))
    
    API.CostOfLiving(location)
    .then(res => console.log("costofliving", res)) 
  }


  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField 
        id="standard-basic" 
        label="Standard"  
        onChange={(e) => setLocation(e.target.value)}
        value={location}
      />
      <TextField 
        id="filled-basic" 
        label="Filled" 
        variant="filled"
        onChange={(e) => setRange(e.target.value)}
        value={range}
       />
      <SubmitBtn handleSubmit={handleSubmit} />
    </form>
  );
}
