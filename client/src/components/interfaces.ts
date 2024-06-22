
export interface IFloorStack {
    floorStack: number[]
}

export interface Elevator {
    id: number;
    currentFloor: number;
    targetFloor: number;
    status: Status;
}

export enum Status {
    UP = 'UP',
    DOWN = 'DOWN',
    IDLE = 'IDLE',
    AT_STOP = 'AT_STOP',
}

export interface Configs {
    [key: string]: number 
}

export interface IFloors {
    floors: number;
    floorStack: number[];
    elevatorFloorMap: { [key: string]: number };
    config: Configs;
    onFloorClick: (floor: number) => void;
}

export interface Elevator {
    id: number;
    currentFloor: number;
    targetFloor: number;
    status: Status;
    position: number;
    stopTime: any;
}

export interface FloorProps {
    floors: number;
    elevators: Elevator[];
    configs: Configs;
}

export interface FormValues {
    floors: number;
    elevators: number;
    randomAssigned: boolean;
  }
  

  export interface FormComponentProps {
    onReset: () => void;
    onSubmit: (values: FormValues) => void;
  }

  
export interface ElevatorProps {
    id: number;
    currentFloor: number;
    targetFloor: number;
    floor: number;
    status: Status;
    position: number;
    stopTime?: any;
    configs: Configs |  null;
}

export interface State {
    elevators: Elevator[];
    floors: number[];
    calledFloors: number[];
    elevatorFloorMap: { [key: string]: number };
  }