#!/bin/sh

# run as root

INSTALL="dnf install"

# install dependencies
$INSTALL g++ libcurl

# build 
g++ ./src/monitoring_agent.cpp -o ./src/monitoring_agent -lcurl

# config
cp ./src/monitoring_agent.rules /etc/audit/rules.d/
cp ./src/monitoring_agent.service /etc/systemd/system/
cp ./src/monitoring_agent_auditd.conf /etc/audit/auditd.conf
#cp ./src/rsyslog_monitoring_agent.conf /etc/rsyslog.d/50-rsyslog_monitoring_agent.conf


# install
cp ./src/monitoring_agent /usr/bin/
chmod 755 /usr/bin/monitoring_agent

# enable service
systemctl enable monitoring_agent
systemctl start monitoring_agent
augenrules --load


