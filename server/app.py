from flask import Flask, request, jsonify
from flask_socketio import SocketIO, send, emit
import threading
from config import client_config, initial_state
from events import register_event_handlers
from utils import reset_state

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

state = initial_state.copy()
stop_tick = threading.Event()
pause_tick = threading.Event()
timer = None
@app.route('/go', methods=['POST'])
def handle_go_post():
    data = request.get_json()
    return jsonify({"status": "success", "received_data": data})

@app.route('/test', methods=['GET'])
def handle_test_get():
    return jsonify({"message": "Hello from Flask GET!"})

@socketio.on('connect')
def handle_connect():
    initial_data = {"config": client_config}
    emit('initial_data', initial_data)

@socketio.on('disconnect')
def handle_disconnect():
    reset_state()

register_event_handlers(socketio, state, stop_tick, pause_tick, timer)

if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
