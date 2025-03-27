
BUILD_DIR=./build

all: build_rpm build_deb

build_rpm:
	cp ./src/* $(BUILD_DIR)/rpm/
	
	rpmbuild 

build_deb: 
	
	dpgk

clean:
	rm -rf $(BUILD_DIR)



	