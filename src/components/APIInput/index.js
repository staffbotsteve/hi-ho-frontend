import React, { createContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import API from "../../utils/API";
import SubmitBtn from "../SubmitBtn";
import Help from "../Help";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ModalCard from "../Modal";
import Slider from "../Slider";
import Wrapper from "../Wrapper"

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    table: {
      minWidth: 650,
    },
  },
}));


//Table Detailing
// const StyledTableCell = withStyles((theme) => ({
//   head: {
//     backgroundColor: theme.palette.common.black,
//     color: theme.palette.common.white,
//   },
//   body: {
//     fontSize: 14,
//   },
// }))(TableCell);

// const StyledTableRow = withStyles((theme) => ({
//   root: {
//     '&:nth-of-type(odd)': {
//       backgroundColor: theme.palette.action.hover,
//     },
//   },
// }))(TableRow);

// Created Context
export const DataContext = createContext();

export default function APIInput() {
  const classes = useStyles();

  const [job, setJob] = useState("");
  const [location, setLocation] = useState("");
  const [range, setRange] = useState("");
  const [result, setResult] = useState("");
  const [zipResult, setZipResult] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if(job === "" && location === "" && range === ""){
      toast.success("Displaying most recently posted jobs in the USA")
    }

    API.zipRecruiter(job, location, range, result).then((res) => {
      setZipResult(res.jobs);
    });
  };



  return (
    <div>
    
        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          style={{ display: "flex" }}
        >
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
          <Slider onChange={(e) => setResult(e)} />
        </form>

        <SubmitBtn handleSubmit={handleSubmit}>Submit</SubmitBtn>

<Wrapper>

        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Job Title</TableCell>
                <TableCell align="left">Company</TableCell>
                <TableCell align="left">Location</TableCell>
                <TableCell align="left">Summary</TableCell>
                <TableCell align="left">Days Posted</TableCell>
                <TableCell align="left">Application</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zipResult.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    <ModalCard
                      location={row.city + ", " + row.state}
                      city={row.city}
                    >
                      {row.name}
                    </ModalCard>
                  </TableCell>
                  <TableCell align="left">{row.hiring_company.name}</TableCell>
                  <TableCell align="left">
                  <ModalCard
                      location={row.city + ", " + row.state}
                      city={row.city}
                    >
                    {row.location}
                    </ModalCard>
                    </TableCell>
                  <TableCell align="left">
                    <a href={row.url} target="_blank" rel="noopener noreferrer">

                    <p dangerouslySetInnerHTML={{ __html: row.snippet }} />

                    </a>
                  </TableCell>
                  <TableCell align="left">{row.job_age}</TableCell>
                  <TableCell align="left">
                    <a href={row.url} target="_blank" rel="noopener noreferrer">
                      Apply
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        </Wrapper>

    </div>
  );
}
