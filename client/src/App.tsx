import React, { useEffect, useState } from 'react';
import { Button, Container } from '@mui/material';
import FormComponent from './components/form';
import Floors from './components/floors';
import styled from 'styled-components';
import Elevators from './components/elevators';
import { Socket, io } from 'socket.io-client';
import { Elevator, FormValues, State, Configs } from './components/interfaces';
import FloorStack from './components/floorStack';

const App: React.FC = () => {
  const [elevators, setElevators] = useState<Elevator[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [floors, setFloors] = useState<number>(0);
  const [floorStack, setFloorStack] = useState<number[]>([]);
  const [elevatorFloorMap, setElevatorFloorMap] = useState<{ [key: string]: number }>({});
  const [configs, setConfigs] = useState<Configs>({});

  const handleOnGenerate = (values: FormValues) => {
    setFloors(values.floors);
    if (socket) {
      socket.emit('generate_elevators', {
        ...values
      });
    }
  };


  useEffect(() => {
    const tempSocket = io('http://localhost:5000');
    setSocket(tempSocket);

    tempSocket.on('get_elevator', (stack: number[]) => {
      setFloorStack(stack)
    });

    tempSocket.on('reset_client', () => {
      setElevators([]);
      setFloorStack([]);
      setElevatorFloorMap({});
      setFloors(0);
    });

    tempSocket.on('initial_data', (initData) => {
      console.log('initData', initData.config);
      
      setConfigs(initData.config);
    })

    tempSocket.on('tick_to_client', (state: State) => {
      setElevators([...state.elevators]);
      setFloorStack(() => [...state.calledFloors]);
      setElevatorFloorMap(() => ({ ...state.elevatorFloorMap }));
    });

    tempSocket.on('generate_elevators', (state: State) => {
      setElevators([...state.elevators]);
      setFloorStack(() => [...state.calledFloors]);
      setElevatorFloorMap(() => ({ ...state.elevatorFloorMap }));
    });

    return () => {
      tempSocket.disconnect();
    };
  }, []);

  const handleOnPause = () => {
    if (socket) {
      socket.emit('pause_tick');
    }
  }

  const handleOnContinue = () => {
    if (socket) {
      socket.emit('continue_tick');
    }
  }

  const handleOnGo = () => {
    if (socket) {
      socket.emit('tick_to_server', {});
    }
  }


  const handleOnFloorClick = (calledFloor: number) => {
    if (socket) {
      socket.emit('call_elevator', { calledFloor });
    }
  }

  const handleOnReset = () => {
    if (socket) {
      socket.emit('reset');
    }
  }

  return (
    <Container>
      <FormComponent onSubmit={handleOnGenerate} onReset={handleOnReset} />
      <Controls>
        <Button type="submit" variant="contained" color="primary" onClick={handleOnGo}>
          Go !
        </Button>
        <Button type="submit" variant="contained" color="primary" onClick={handleOnPause}>
          Pause !
        </Button>
        <Button type="submit" variant="contained" color="primary" onClick={handleOnContinue}>
          Continue !
        </Button>
      </Controls>
      {elevators?.length > 0 &&
        <Display>
          <FloorStack floorStack={floorStack} />
          <Floors
            floors={floors}
            onFloorClick={handleOnFloorClick}
            floorStack={floorStack}
            elevatorFloorMap={elevatorFloorMap}
            config={configs}
          />
          <Elevators elevators={elevators} floors={floors} configs={configs}/>
        </Display>
      }
    </Container>
  );
}

export default App;

const Display = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
  gap: 5px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 20px;
`;