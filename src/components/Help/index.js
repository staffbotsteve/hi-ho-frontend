import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';



// const longText = `
// Enter the number of miles you would like to use for your search radius. EX. An input of "25" will search for jobs within a 25 mile radius of your desired location.
// `;

export default function Help(props) {

  return (
    <div style={{ width: "20px", marginLeft: "-5px", marginRight: "30px", marginTop:"0px", marginBottom:"30px"}}>
      <Tooltip title={props.help} >
      <HelpOutlineIcon style={{ width: "20px", color: "gray"}} />
      </Tooltip>
    </div>
  );
}
