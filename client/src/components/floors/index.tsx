import { Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { IFloors } from '../interfaces';

const enum FloorType {
    CALLED = 'CALLED',
    WAITING_FOR_ELEVATOR = 'WAITING_FOR_ELEVATOR',
    DEFUALT = 'DEFAULT'
}

const Floors: React.FC<IFloors> = ({
    floors,
    floorStack,
    config,
    onFloorClick,
    elevatorFloorMap
}) => {

    const isFloorInStack = (floor: number) => floorStack.includes(floor)

    const handleOnClick = (floor: number) => {
        if (isFloorInStack(floor)) return;
        onFloorClick(floor);
    }

    const getType = (floor: number) => {
        if (elevatorFloorMap[floor]) {
            return FloorType.WAITING_FOR_ELEVATOR
        }
        if (isFloorInStack(floor)) {
            return FloorType.CALLED
        }
        return FloorType.DEFUALT;
    }

    return (
        <Container>
            {Array.from({ length: floors }, (_, i) => (
                <SingleFloor key={i}
                    type={getType(floors - i)}
                    onClick={() => handleOnClick(floors - i)}
                    height={config?.["FLOOR_HEIGHT"] || 50}
                    >
                    <Typography variant="h5" component="h1" gutterBottom>
                        {floors - i}
                    </Typography>
                </SingleFloor>
            ))}
        </Container>
    );
};

export default Floors;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    gap: 10px;
`

const SingleFloor = styled.div<{ type: FloorType, height: number }>`
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${props => props.height}px;
    width: ${props => props.height}px;
    padding: 8px;
    border: 1px solid black;
    border-radius: 4px;
    background-color: #f0f0f0;
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.2);
    cursor: pointer;
    background-color: ${props => {
        switch (props.type) {
            case FloorType.CALLED:
                return 'red';
            case FloorType.WAITING_FOR_ELEVATOR:
                return 'green';
            default:
                return '#f0f0f0';
        }
    }};
    pointer-events: ${props => props.type === FloorType.CALLED ? 'none' : 'auto'};
    &:hover {
    background-color: #e0e0e0;
    border: 1px solid #000;
    }
`;