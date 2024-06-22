# Use an official Python image as the base image
FROM python:3.11.9

# Set the working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt .

RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port on which your app will run
EXPOSE 5000

# Command to run your application
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app", "--worker-class", "eventlet", "--workers", "1"]
