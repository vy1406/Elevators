import copy
import time
import random
from config import client_config, server_config, initial_state

def periodic_tick(socketio, stop_tick, pause_tick, state):
    while not stop_tick.is_set():
        if not pause_tick.is_set():
            handle_tick(socketio, state)
        socketio.sleep(0.02)

def reset_state():
    global state
    state = copy.deepcopy(initial_state)

def get_random_floor(max_floors):
    return random.randint(1, max_floors)

def is_any_floor_called(state):
    return len(state['calledFloors']) > 0

def calculate_stay_duration(elevator):
    current_time = time.time()
    stop_time = elevator.get('stopTime')
    if stop_time is None:
        return 0
    stay_duration = current_time - stop_time
    return stay_duration

def seconds_left_on_the_floor(elevator):
    stay_duration = calculate_stay_duration(elevator)
    seconds_left = server_config['SECONDS_ON_FLOOR'] - min(server_config['SECONDS_ON_FLOOR'], stay_duration)
    return seconds_left

def calculate_closest_elevator(state):
    if not state['calledFloors']:
        print("No called floors to process.")
        return None

    elevator_dict = {}
    popped_floor = state['calledFloors'][0]
    for elevator in state['elevators']:
        if elevator['status'] == 'IDLE':
            time_to_reach = abs(elevator['currentFloor'] - popped_floor) * server_config['TIME_TO_FLOOR'] + server_config['SECONDS_ON_FLOOR']
            elevator_dict[elevator['id']] = time_to_reach
        elif elevator['status'] == 'AT_STOP':
            time_left_on_floor = seconds_left_on_the_floor(elevator)
            time_to_reach = abs(elevator['currentFloor'] - popped_floor) * server_config['TIME_TO_FLOOR'] + time_left_on_floor
            elevator_dict[elevator['id']] = time_to_reach

    if not elevator_dict:
        print("No available elevators to assign.")
        return None

    closest_elevator_id = min(elevator_dict, key=elevator_dict.get)
    return closest_elevator_id

def assign_new_floor(closest_elevator_id, called_floor, state):
    for elevator in state['elevators']:
        if elevator['id'] == closest_elevator_id:
            state["elevatorFloorMap"][called_floor] = elevator['id']
            elevator['targetFloor'] = called_floor
            elevator['status'] = 'UP' if elevator['currentFloor'] < elevator['targetFloor'] else 'DOWN'
            elevator['targetFloorPosition'] = (elevator['targetFloor'] - 1) * client_config['FLOOR_HEIGHT'] + (client_config['GAP'] * (elevator['targetFloor'] - 1))
            elevator['stopTime'] = None
            break

def is_elevator_reached_floor(elevator):
    return elevator['targetFloorPosition'] == elevator['position']

def is_any_elevator_idle(state):
    for elevator in state['elevators']:
        if elevator['status'] == 'IDLE':
            return True
    return False

def delete_key_by_value(d, value):
    for key, val in list(d.items()):
        if val == value:
            del d[key]
            break

def handle_tick(socketio, state):
    if is_any_floor_called(state):
        if is_any_elevator_idle(state):
            closest_elevator_id = calculate_closest_elevator(state)
            popped_floor = state['calledFloors'].pop(0)
            print(f"Assigning floor {popped_floor} to elevator {closest_elevator_id}")
            assign_new_floor(closest_elevator_id, popped_floor, state)

    current_time = time.time()
    for elevator in state['elevators']:
        if elevator['status'] == 'IDLE':
            continue

        if elevator['status'] == 'AT_STOP':
            elapsed_time = current_time - elevator['stopTime']
            if elapsed_time >= server_config['SECONDS_ON_FLOOR']:
                elevator['status'] = 'IDLE'
                elevator['targetFloor'] = None
                delete_key_by_value(state["elevatorFloorMap"], elevator['id'])
            continue

        if is_elevator_reached_floor(elevator):
            elevator['currentFloor'] = elevator['targetFloor']
            elevator['stopTime'] = current_time
            elevator['status'] = 'AT_STOP'
            continue

        if elevator['status'] == 'UP':
            elevator['position'] += 1
        elif elevator['status'] == 'DOWN':
            elevator['position'] -= 1

    socketio.emit('tick_to_client', state)
