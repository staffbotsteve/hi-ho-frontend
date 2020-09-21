import React, { useState, useEffect } from "react";
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
import Wrapper from "../Wrapper";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./style.css";

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
  const [saveJobArray, setSavedJobArray] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (job === "" && location === "" && range === "") {
      toast.success("Displaying most recently posted jobs in the USA");
    }

    API.zipRecruiter(job, location, range, result).then((res) => {
      setZipResult(res.jobs);
    });
  };

  useEffect(() => {
    console.log("got here", token);
  }, [token]);

  const backendUrl = process.env.REACT_APP_API_URL;

  const handleJobSave = (data) => {
    const {
      id,
      name,
      hiring_company,
      location,
      snippet,
      job_age,
      url,
      city,
      state,
      posted_time,
    } = data;

    const company = hiring_company.name;

    const savedJobs = () => {
      fetch(`${backendUrl}/jobs`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          jobId: id,
          userId: token.id,
          name,
          company,
          location,
          snippet,
          job_age,
          url,
          city,
          state,
          posted_time,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success("Job saved to profile");

          fetch(`${backendUrl}/jobs/${token.id}`)
            .then((res) => res.json())
            .then((response) => {
              const { data } = response;
              console.log("data", data);

              setSavedJobArray(data);
            });
        });
    };
    if (token) {
      savedJobs();
    } else {
      toast.error("Must be logged in to save");
    }
  };

  useEffect(() => {
    if (token) {
      console.log(`${backendUrl}/jobs/${token.id}`);
      fetch(`${backendUrl}/jobs/${token.id}`)
        .then((res) => res.json())
        .then((response) => {
          const { data } = response;
          console.log("data", data);

          setSavedJobArray(data);
        });
    }
  }, [token]);

  const savedJobsIds = saveJobArray.map((job) => job.jobId);

  return (
    <div>
      <h1 className="center">Search for a Job</h1>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "50px",
        }}
        onSubmit={handleSubmit}
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
        <Help help="EX. An input of 25 will search for jobs within a 25 mile radius of your desired location." />
        <Slider onChange={(e) => setResult(e)} />
        <br></br>

        <SubmitBtn type="submit" handleSubmit={handleSubmit}>
          Submit
        </SubmitBtn>
      </form>

      <div>
        <h4 className="center" style={{color: "darkslategray"}}>Click on a Job Title or Location to learn more about the cost of living</h4>

        <Wrapper>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Job Title</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>Company</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>Location</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>Summary</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>Days Posted</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>Application</strong>
                  </TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {zipResult
                  .filter((job) => !savedJobsIds.includes(job.id))
                  .map((row) => (
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
                      <TableCell align="left">
                        {row.hiring_company.name}
                      </TableCell>
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
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="snippetLink"
                        >
                          <p
                            dangerouslySetInnerHTML={{ __html: row.snippet }}
                          />
                        </a>
                      </TableCell>
                      <TableCell align="left">{row.job_age}</TableCell>
                      <TableCell align="left">
                        <Button
                          variant="contained"
                          color="primary"
                          href={row.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Apply
                        </Button>
                      </TableCell>
                      <TableCell align="left">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleJobSave(row)}
                        >
                          <img
                            src={
                              process.env.PUBLIC_URL + "/images/hihodiamond.png"
                            }
                            className="diamond"
                            alt="diamond"
                          />
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
    </div>
  );
}
