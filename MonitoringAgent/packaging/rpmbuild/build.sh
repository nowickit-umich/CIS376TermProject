#!/bin/bash

set -e
sudo dnf install -y rpm-build
mkdir -p ./packaging/rpmbuild/{BUILD,RPMS,SOURCES,SPECS,SRPMS}
cp -r ./src/* ./packaging/rpmbuild/SOURCES/

rpmbuild -bb --buildroot ./packaging/rpmbuild/BUILD/ ./packaging/rpmbuild/SPECS/monitoring_agent.spec

cp ./packaging/rpmbuild/RPMS/x86_64/monitoring_agent-1.0-1.x86_64.rpm .

echo "RPM build complete!"
