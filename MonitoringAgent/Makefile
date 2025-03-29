
BUILD_DIR=./build

all: build_rpm build_deb

install:
	chmod +x ./src/install.sh
	./src/install.sh

build_rpm:
	chmod +x ./packaging/rpmbuild/build.sh
	./packaging/rpmbuild/build.sh

build_deb: 
	echo "TODO"

clean:
	rm -rf $(BUILD_DIR)



