#!/bin/bash

set -e
sudo dnf install -y rpm-build
mkdir -p ~/rpmbuild/{BUILD,RPMS,SOURCES,SPECS,SRPMS}
cp -r ./src/* ~/rpmbuild/SOURCES/

rpmbuild -bb ~/rpmbuild/SPECS/monitoring_agent.spec

cp ~/rpmbuild/RPMS/x86_64/monitoring_agent-1.0-1.x86_64.rpm .

echo "RPM build complete!"
