import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from "@material-ui/core";
import ModalCard from "../Modal";
import Wrapper from "../Wrapper"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileModal from "../ProfileModal";

import "./style.css";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const Profile = ({ token }) => {
  const [data, setData] = useState({});
  const [zipResult, setZipResult] = useState([]);

  const url = process.env.REACT_APP_API_URL;
  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    const updateProfile = () => {
      fetch(`${url}/me/${token.id}`, {
        headers: {
          Authorization: accessToken,
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((response) => {
          console.log("got hereeee");
          const { data } = response;

          if (response.success) {
            setData(data);
            console.log("data profile", response);
          }
        });

      fetch(`${url}/jobs/${token.id}`)
        .then(res => res.json())
        .then(response => {
          const { data } = response;
          console.log("data", data)
          setZipResult(data);
        })
    }
    if (token) {
      updateProfile()
    }
  }, []);

  const backendUrl = process.env.REACT_APP_API_URL;

  const handleJobDelete = (row) => {


    const { id } = token;
    const objId = row._id

    if (!token) {
      toast.error("Must be logged in to save")
    } else {
      fetch(`${backendUrl}/jobs/:` + objId, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
        }),
      })
        .then(res => res.json())
        .then(data => {
          toast.success("Job successfully deleted")
          fetch(`${url}/jobs/${token.id}`)
            .then(res => res.json())
            .then(response => {
              const { data } = response;
              console.log("data", data)
              setZipResult(data);
            })
        })
    };
  }

  const classes = useStyles();

  const { firstName, lastName, email, phone } = data;

  const formatTime = (date) => {
    const dateTime = date.replace("T", "-").split("-")
    return `${dateTime[1]}-${dateTime[2]}-${dateTime[0]}`
  }

  return (
    <div>
      <Wrapper>

        <h1 style={{ textAlign: "center" }}>Welcome {firstName} {lastName}</h1>
        <h3 style={{ textAlign: "center" }}>Email: {email}</h3>
        <h3 style={{ textAlign: "center" }}>Phone Number: {phone}</h3>
        <ProfileModal data={data} setData={setData}/>
        <br></br>
        <h2 className="center">Your Saved Jobs</h2>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Job Title</strong></TableCell>
                  <TableCell align="left"><strong>Company</strong></TableCell>
                  <TableCell align="left"><strong>Location</strong></TableCell>
                  <TableCell align="left"><strong>Summary</strong></TableCell>
                  <TableCell align="left"><strong>Date Posted</strong></TableCell>
                  <TableCell align="left"><strong>Application</strong></TableCell>
                  <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zipResult.map((row, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    <ModalCard
                      location={row.city + ", " + row.state}
                      city={row.city}
                    >
                      {row.name}
                    </ModalCard>
                  </TableCell>
                  <TableCell align="left">{row.company}</TableCell>
                  <TableCell align="left">{row.location}</TableCell>
                  <TableCell align="left">
                    <p dangerouslySetInnerHTML={{ __html: row.snippet }} />
                  </TableCell>
                  <TableCell align="left">{formatTime(row.posted_time)}</TableCell>
                  <TableCell align="left">
                    <Button variant="contained" color="primary" href={row.url} target="_blank" rel="noopener noreferrer" >
                      Apply
                     </Button>

                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleJobDelete(row)}>
                      Delete
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
};

export default Profile;
