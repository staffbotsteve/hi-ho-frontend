import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import API from "../utils/API";
import SubmitBtn from "../components/SubmitBtn";
import {
  Table,
  TableBody,
  TableContainer,
  Paper,
  Button,
} from "@material-ui/core";
import TableHeader from "../components/TableHeader";
import MappedTable from "../components/MappedTable";
import Slider from "../components/Slider";
import Wrapper from "../components/Wrapper";
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
  cellHidden: {
    display: "hidden",
  },
}));

export default function Home(props) {
  const token = props.token;
  const classes = useStyles();

  const [job, setJob] = useState("");
  const [location, setLocation] = useState("");
  const [range, setRange] = useState("");
  const [result, setResult] = useState("25");
  const [zipResult, setZipResult] = useState([]);
  const [saveJobArray, setSavedJobArray] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (job === "" && location === "" && range === "") {
      toast.success("Displaying most recently posted jobs in the USA");
    }

    const res = await API.usaJobs(job, location, range, result);
    setZipResult(res);
  };

  const backendUrl = process.env.REACT_APP_API_URL;

  const handleJobSave = ({ MatchedObjectDescriptor }) => {
    const {
      PositionID,
      PositionTitle,
      OrganizationName,
      PositionStartDate,
      PositionURI,
    } = MatchedObjectDescriptor;

    const savedJobs = () => {
      fetch(`${backendUrl}/jobs`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          jobId: PositionID,
          userId: token.id,
          name: PositionTitle,
          company: OrganizationName,
          location: MatchedObjectDescriptor.PositionLocation[0].CityName,
          snippet: MatchedObjectDescriptor.UserArea.Details.JobSummary,
          url: PositionURI,
          posted_time: PositionStartDate,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success("Job saved to profile");

          fetch(`${backendUrl}/jobs/${token.id}`)
            .then((res) => res.json())
            .then((response) => {
              const { data } = response;
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
      fetch(`${backendUrl}/jobs/${token.id}`)
        .then((res) => res.json())
        .then((response) => {
          const { data } = response;
          setSavedJobArray(data);
        });
    }
  }, [token, backendUrl]);

  const savedJobsIds = saveJobArray.map((job) => job.jobId);

  return (
    <div token={props.token}>
      <h1 style={{ textAlign: "center" }}>Search for a Job</h1>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          margin: "50px",
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          required
          label="Job Keyword"
          placeholder="ex. Engineer"
          variant="outlined"
          onChange={(e) => setJob(e.target.value)}
          value={job}
        />

        <TextField
          required
          label="Location"
          placeholder="ex. Berkeley"
          variant="outlined"
          onChange={(e) => setLocation(e.target.value)}
          value={location}
        />

        <TextField
          required
          label="Mile Radius"
          placeholder="ex. 25"
          variant="outlined"
          onChange={(e) => setRange(e.target.value)}
          value={range}
        />
        <Slider onChange={(e) => setResult(e)} />

        <SubmitBtn type="submit" handleSubmit={handleSubmit}>
          Submit
        </SubmitBtn>
      </form>

      <div>
        <h4 style={{ color: "darkslategray", textAlign: "center" }}>
          Click on a Job Title or Location to learn more about the cost of
          living
        </h4>

        <Wrapper>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHeader>Save</TableHeader>
              <TableBody>
                {zipResult
                  .filter((job) => !savedJobsIds.includes(job.id))
                  .map((row) => (
                    <MappedTable
                      key={row.MatchedObjectDescriptor.PositionID}
                      location={row.MatchedObjectDescriptor.PositionLocation}
                      name={row.MatchedObjectDescriptor.OrganizationName}
                      title={row.MatchedObjectDescriptor.PositionTitle}
                      minSalary={
                        row.MatchedObjectDescriptor.PositionRemuneration[0]
                          .MinimumRange
                      }
                      maxSalary={
                        row.MatchedObjectDescriptor.PositionRemuneration[0]
                          .MaximumRange
                      }
                      snippet={
                        row.MatchedObjectDescriptor.UserArea.Details.JobSummary
                      }
                      positionURL={row.MatchedObjectDescriptor.PositionURI}
                      applyURL={row.MatchedObjectDescriptor.ApplyURI[0]}
                      postedDate={row.MatchedObjectDescriptor.PositionStartDate}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleJobSave(row)}
                      >
                        <img
                          src={
                            process.env.PUBLIC_URL + "/images/hihodiamond.png"
                          }
                          style={{ width: "20px", marginRight: "10px" }}
                          alt="diamond"
                        />
                        Save
                      </Button>
                    </MappedTable>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Wrapper>
      </div>
    </div>
  );
}
