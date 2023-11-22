import React from "react";
import { Card, CardContent, Avatar } from "@mui/material";

const MsgCard = () => {
  return (
    <>
      <Card>
        <CardContent>
          <Avatar sx={{ backgroundColor: "red" }} aria-label="recipe">
            R
          </Avatar>
        </CardContent>
      </Card>
    </>
  );
};

export default MsgCard;
