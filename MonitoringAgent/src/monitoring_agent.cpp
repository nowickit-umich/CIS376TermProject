#include <iostream>
#include <chrono>
#include <thread>
#include <curl/curl.h>

using namespace std;

int main(){

    CURL* curl = curl_easy_init();

    while(1==1){
        cout << "MONITORING AGENT TEST!" << endl;
        this_thread::sleep_for(chrono::seconds(5));
    }

    curl_easy_cleanup(curl);
    
    return 0;
}