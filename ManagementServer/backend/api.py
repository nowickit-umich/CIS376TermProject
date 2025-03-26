from flask import Flask, jsonify
import pymysql

app = Flask(__name__)

db_config = {
    "host": "database",
    "user": "user",
    "password": "pass",
    "database": "app_db"
}

@app.route("/test", methods=['GET'])
def test():
    return "This is a test!"

@app.route("/dbtest", methods=['GET'])
def dbtest():
    connection = None
    try:
        connection = pymysql.connect(**db_config, cursorclass=pymysql.cursors.DictCursor)
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM alerts;")
            result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        if connection:
            connection.close()



