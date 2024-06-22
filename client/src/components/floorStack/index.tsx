import React from 'react';
import { IFloorStack } from '../interfaces'
import styled from 'styled-components';
import { Typography } from '@mui/material';

const FloorStack: React.FC<IFloorStack> = ({ floorStack }) => {
    return (
        <Container>
            <Header>
                <Typography variant="h6">Floor Stack</Typography>
            </Header>
            {floorStack.map((card, index) => (
                <Floor key={index} className="card">{card}</Floor>
            ))}
        </Container>
    );
}

export default FloorStack;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 20px 0px 0px;
    border: 1px solid #000;
    border-radius: 5px;
    padding: 5px;
`

const Header = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;
`

const Floor = styled.div`

`