Name: monitoring_agent
Version: 1.0
Release: 1
Summary: System Monitoring Agent
License: GPL
Source0: %{name}-%{version}.tar.gz

Requires: systemd auditd

%description
Monitors processes and sends logs to management server.

%prep
%setup -q

%build
# TODO

%install


%post
%systemd_post monitoring_agent.service

%preun
# Stop and disable the service before uninstalling
if [ $1 -eq 0 ]; then
    systemctl stop monitoring_agent.service || true
    systemctl disable monitoring_agent.service || true
fi

%postun
# Reload systemd daemon on uninstall
%systemd_postun_with_restart monitoring_agent.service

%files
# TODO
