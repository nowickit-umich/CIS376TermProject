#!/bin/sh

# run as root

INSTALL="dnf install"

# install dependencies
$INSTALL auditd g++

# build 
g++ ./src/monitoring_agent.cpp -o ./src/monitoring_agent

# config
cp ./src/monitoring_agent.rules /etc/auditd/rules.d/
cp ./src/monitoring_agent.service /etc/systemd/system/

# install
cp ./src/monitoring_agent /usr/bin/
chmod 755 /usr/bin/monitoring_agent

# enable service
systemctl enable monitoring_agent
systemctl start monitoring_agent

