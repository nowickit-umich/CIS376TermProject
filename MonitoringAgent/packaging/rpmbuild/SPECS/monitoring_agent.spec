
Name: monitoring_agent
Version: 1.0
Release: 1
Summary: System Monitoring Agent
License: GPL
Source0: %{name}-%{version}.tar.gz
BuildArch: noarch

Requires: systemd auditd

%description
Monitors processes and sends logs to management server.

%prep
%setup -q

%build
# TODO

%install
mkdir -p %{buildroot}%{_bindir}
mkdir -p %{buildroot}/etc/systemd/system
mkdir -p %{buildroot}/etc/audit/rules.d
install -m 755 monitoring_agent %{buildroot} %{_bindir}/monitoring_agent
install -m 644 monitoring_agent.rules %{buildroot}/etc/audit/rules.d/monitoring_agent.rules
install -m 644 monitoring_agent.service %{buildroot}/etc/systemd/system/monitoring_agent.service


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
%{_bindir}/monitoring_agent
/etc/systemd/system/monitoring_agent.service
/etc/audit/rules.d/monitoring_agent.rules


