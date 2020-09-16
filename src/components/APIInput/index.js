import React, {useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import API from "../../utils/API";
import SubmitBtn from "../SubmitBtn";
import Help from "../Help";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@material-ui/core";
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

export default function APIInput({ token }) {
  const classes = useStyles();

  const [job, setJob] = useState("");
  const [location, setLocation] = useState("");
  const [range, setRange] = useState("");
  const [result, setResult] = useState("");
  const [zipResult, setZipResult] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (job === "" && location === "" && range === "") {
      toast.success("Displaying most recently posted jobs in the USA")
    }

    API.zipRecruiter(job, location, range, result).then((res) => {
      setZipResult(res.jobs);
      console.log("jobs", res.jobs);
    });
  };

  useEffect(() => {
    console.log("got here", token);
  }, [token]);

  const backendUrl = process.env.REACT_APP_API_URL;

  const handleJobSave = (data) => {
    const {
      name,
      hiring_company,
      location,
      snippet,
      job_age,
      url,
      city,
      state,
      posted_time
    } = data;

   
    const company = hiring_company.name;
    const { id } = token;

    if (!token) {
      toast.error("Must be logged in to save")
    } else {
      fetch(`${backendUrl}/jobs`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          name,
          company,
          location,
          snippet,
          job_age,
          url,
          city,
          state,
          posted_time
        }),
      })
        .then(res => res.json())
        .then(data => {
          toast.success("Job saved to profile")
        })
    };
  }


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
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zipResult.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    <ModalCard
                      location={row.city + ", " + row.state}
                      city={row.city}
                      name={row.name}
                    >
                      {row.name}
                    </ModalCard>
                  </TableCell>
                  <TableCell align="left">{row.hiring_company.name}</TableCell>
                  <TableCell align="left">
                    <ModalCard
                      location={row.city + ", " + row.state}
                      city={row.city}
                      name={row.name}
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
                  <TableCell align="left">
                    <Button variant="contained" color="primary" onClick={() => handleJobSave(row)} >
                      Save
                    </Button>
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
