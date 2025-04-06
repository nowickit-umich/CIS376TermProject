from flask import Flask, jsonify, request
import pymysql
import re

app = Flask(__name__)

db_config = {
    "host": "database",
    "user": "user",
    "password": "pass",
    "database": "app_db"
}

@app.route("/test", methods=['GET'])
def test():
    return "{\"test\": \"This is a test!\"}"

@app.route("/dbtest", methods=['GET'])
def dbtest():
    connection = None
    try:
        connection = pymysql.connect(**db_config, cursorclass=pymysql.cursors.DictCursor)
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM events;")
            result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        if connection:
            connection.close()

@app.route("/submit_logs", methods=['POST'])
def submit_logs():
    data = request.get_json()
    print(data, flush=True)
    #return jsonify({"response": "ok"}), 200
    endpoint_id = data['id']
    for raw_event in data['logs']:
        print(raw_event, flush=True)
        #return jsonify({"response": "ok"}), 200
        #parse event
        for x in raw_event.split(' '):
            syscall = re.search(r'syscall=([^\s]+)', x)
            pid = re.search(r'pid=([^\s]+)', x)
            uid = re.search(r'uid=([^\s]+)', x)
            euid = re.search(r'euid=([^\s]+)', x)
            timestamp = re.search(r'msg=audit\(([^:]+)', x)

            #insert into database
            try:
                connection = pymysql.connect(**db_config, cursorclass=pymysql.cursors.DictCursor)
                with connection.cursor() as cursor:
                    cursor.execute(f"INSERT INTO events (endpoint_id, event_time, message, event_type, pid) VALUES ( {endpoint_id}, {timestamp}, {x}, {syscall}, {pid} );")
                    result = cursor.fetchall()
                return jsonify(result)
            except Exception as e:
                return jsonify({"error": str(e)})
            finally:
                if connection:
                    connection.close()
    return

