from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory user storage
users = {}

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
            cursor.execute("SELECT * FROM alerts;")
            result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        if connection:
            connection.close()

@app.route("/register", methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    connection = None
    try:
        connection = pymysql.connect(**db_config, cursorclass=pymysql.cursors.DictCursor)
        with connection.cursor() as cursor:
            # Check if user exists
            cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
            if cursor.fetchone():
                return jsonify({"error": "Username already exists"}), 400
            
            # Insert new user
            cursor.execute("INSERT INTO users (username, passwordhash) VALUES (%s, %s)", (username, password))
            connection.commit()
            return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        if connection:
            connection.close()

@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    connection = None
    try:
        connection = pymysql.connect(**db_config, cursorclass=pymysql.cursors.DictCursor)
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE username = %s AND passwordhash = %s", (username, password))
            user = cursor.fetchone()
            
            if not user:
                return jsonify({"error": "Invalid username or password"}), 401
            
            return jsonify({"message": "Login successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        if connection:
            connection.close()



