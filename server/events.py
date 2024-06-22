from utils import (
    get_random_floor, reset_state, periodic_tick
)

from config import client_config

def register_event_handlers(socketio, state, stop_tick, pause_tick, timer):
    @socketio.on('reset')
    def handle_reset():
        reset_state()
        stop_tick.set()  # Signal the thread to stop
        socketio.emit('reset_client')

    @socketio.on('pause_tick')
    def handle_pause_tick():
        pause_tick.set()  # Pause the periodic tick
        socketio.emit('tick_paused')

    @socketio.on('continue_tick')
    def handle_continue_tick():
        pause_tick.clear()  # Continue the periodic tick
        socketio.emit('tick_continued')

    @socketio.on('message')
    def handle_message(msg):
        socketio.send("Hello from Flask!", broadcast=True)

    @socketio.on('generate_elevators')
    def generate_elevators(data):
        elevators_count = data['elevators']
        floors = data['floors']
        random_assigned = data['randomAssigned']

        elevators = []
        for i in range(1, elevators_count + 1):
            current_floor = get_random_floor(floors) if random_assigned else 1
            target_floor = None
            if (target_floor is None) or (target_floor == current_floor):
                status = "IDLE"
            else:
                status = "UP" if current_floor < target_floor else "DOWN"

            position = (client_config['FLOOR_HEIGHT'] * (current_floor - 1)) + (client_config['GAP'] * (current_floor - 1))

            elevators.append({
                "id": i,
                "currentFloor": current_floor,
                "targetFloor": target_floor,
                "targetFloorPosition": None,
                "status": status,
                "position": position
            })

        state['elevators'] = elevators
        state['floors'] = floors
        socketio.emit('generate_elevators', state)

    @socketio.on('call_elevator')
    def call_elevator(data):
        calledFloor = data['calledFloor']
        called_floor_stack = state['calledFloors']
        called_floor_stack.append(calledFloor)
        state['calledFloors'] = called_floor_stack
        socketio.emit('get_elevator', called_floor_stack)

    @socketio.on('tick_to_server')
    def start_periodic_tick(data):
        if stop_tick.is_set():
            stop_tick.clear()
        if pause_tick.is_set():
            pause_tick.clear()
        timer = socketio.start_background_task(periodic_tick, socketio, stop_tick, pause_tick, state)
