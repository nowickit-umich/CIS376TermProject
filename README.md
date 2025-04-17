# Endpoint Security Monitoring System

This project consists of two main components: the Monitoring Agent and the Management Server. The Monitoring Agent is installed on the devices you want to monitor. The Management server is installed on your organizations network infrastructure. Both Cloud and On-Premise servers are supported. 



# Monitoring Agent Overview
The Monitoring Agent currently supports Fedora-40 systems. This can be extended to any kernel version greater than 5.8 in the future. The monitoring agent can be easily managed via systemd. 

Start/Stop/Status of the Monitoring Agent:

> systemctl start monitoringAgent.service

> systemctl stop monitoringAgent.service

> systemctl status monitoringAgent.service
 

Install:
To install the monitoring agent simply run the install.sh script located in `./MonitoringAgent/install.sh`

Note: the install script must be run as root

Network: Requires outgoing network access on port `5001`

# Management Server Overview
The Management server consists of a set of docker containers managed by docker-compose. The server can be installed on any system with docker and docker compose installed. An install script is included for Fedora-40 systems. 

Install Dependencies (Fedora-40 only):
Run the install script located in `./ManagementServer/install.sh`

Start Server:
docker compose up --build

Network: Requires full access on ports `3000` and `5001`

