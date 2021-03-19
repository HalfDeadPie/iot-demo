IoT Demo
***************************
Introduction
============================
This project is the implementation of my interview exercise.

- IoT decoder of hex payload
- REST API returning decoded payload in JSON
- Dockerfile to deploy REST API
- Deploy solution on the free cloud

Install and start
==================

**Clone the solution to the local repository**:

    git clone https://github.com/HalfDeadPie/iot-demo

**Build the image in the repository**:

    docker build -t iot-demo .

**Run the app**:

    docker run -p 8080:8080 iot-demo

Testing
====================
The application was deployed on the free cloud and tested using these apps:

- Postman
- Curl
- Internet Browser

**Example**

    curl 3.15.159.68:8080/decoder?payload=cbb409c401990109857fff

    {"battery status":"Good", battery voltage":2996, "builtin temperature":25, "builtin humidity":40.9, "external type":"E1 Temperature sensor", "external data":24.37}

