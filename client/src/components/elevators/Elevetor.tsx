import React from "react";
import { Typography } from "@mui/material";
import styled from "styled-components";
import { Status, ElevatorProps } from "../interfaces";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const Elevator: React.FC<ElevatorProps> = ({
    id,
    floor,
    status,
    configs,
    position,
    targetFloor,
    currentFloor,
}) => {

    if (floor !== currentFloor || configs === null) return null;

    const calcMarginRight = () => configs["FLOOR_HEIGHT"] * (id - 1) + configs["GAP"] * (id - 1);

    return (
        <Container
            position={position}
            margin={calcMarginRight()}
            height={configs["FLOOR_HEIGHT"]}
        >
            <Typography variant="body1">{id}</Typography>
            <Typography variant="body1">:{targetFloor}</Typography>
            {status === Status.UP && <ArrowUpwardIcon />}
            {status === Status.DOWN && <ArrowDownwardIcon />}
            {status === Status.IDLE && <Typography variant="body1">-</Typography>}
        </Container>
    );
};

export default Elevator;

const Container = styled.div<{ position: number, margin: number, height: number }>`
  height: ${({ height }) => height}px;
  width: ${({ height }) => height}px;
  position: absolute;
  left: ${({ margin }) => margin}px;
  bottom: ${({ position }) => position}px;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  border: 1px solid red;
`;
