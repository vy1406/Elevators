import React from 'react';
import styled from 'styled-components';
import { FloorProps } from '../interfaces';
import Elevator from './Elevetor';

const Elevators: React.FC<FloorProps> = ({ floors, elevators = [], configs = null }) => {
  return (
    <Container>
      {Array.from({ length: floors }, (_, i) => (
        <SingleFloor key={i}>
          {elevators.map(elevator => 
            <Elevator key={elevator.id} {...elevator} floor={floors - i} configs={configs || null}/>  
          )}
        </SingleFloor>
      ))}
    </Container>
  );
};

export default Elevators;

const Container = styled.div`
  margin-top: 20px;
  position: relative;
`;

const SingleFloor = styled.div``;
