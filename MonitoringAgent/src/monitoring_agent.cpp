#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <chrono>
#include <thread>
#include <mutex>
#include <cpr/cpr.h>
#include <unistd.h>
#include <syslog.h>

using namespace std;

static const int BUFFER_SIZE = 128;
static const string LOG_FILE = "log.txt";
static const string API = "http://127.0.0.1:5001/submit_logs";

vector<string> buffer;
mutex buffer_mutex;

void send_logs() {
	while(true){
		//spinlock, TODO use semaphore
		if(buffer.size() < 16) continue;

		string payload = "{\"logs\": \"";
		buffer_mutex.lock();
		for (string log : buffer){
			payload += "<x>" + log + "</x>";
		}
		payload += "\"";
		buffer.clear();
		buffer_mutex.unlock();
	
		auto response = cpr::Post(cpr::Url{API}, cpr::Header{{"Content-Type", "application/json"}}, cpr::Body{payload});
		
		syslog(LOG_INFO, "Sent Logs!");
	}
}

void monitor_logs(){
	string log = "";
	while(true){
		buffer_mutex.lock();
		// it may be better to use a non-blocking form of getline
		while(getline(cin, log) && buffer.size() < BUFFER_SIZE){
			buffer.push_back(log);
		}
		buffer_mutex.unlock();
	}
}

int main(){
	openlog("agentPlugin", LOG_PID | LOG_CONS, LOG_USER);
	syslog(LOG_INFO, "It Works!");
	
	
	thread send(send_logs);

	monitor_logs();

	syslog(LOG_ERR, "It Broke!");
	closelog();

	return 0;
}
