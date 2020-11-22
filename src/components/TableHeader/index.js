import React from "react";
import { TableCell, TableHead, TableRow } from "@material-ui/core";

export default function TableHeader(props) {
  return (
    <TableHead className="tableHead">
      <TableRow>
        <TableCell align="center">
          <strong>Job Title</strong>
        </TableCell>
        <TableCell align="center">
          <strong>Pay %</strong>
        </TableCell>
        <TableCell align="left">
          <strong>Company</strong>
        </TableCell>
        <TableCell align="left">
          <strong>Location</strong>
        </TableCell>
        <TableCell align="center">
          <strong>Salary</strong>
        </TableCell>
        <TableCell align="left">
          <strong>Summary</strong>
        </TableCell>
        <TableCell align="left">
          <strong>Posted Date</strong>
        </TableCell>
        <TableCell align="left">
          <strong>Application</strong>
        </TableCell>
        <TableCell align="left">
          <strong>{props.children}</strong>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
