import time
import pymysql

db_config = {
    "host": "database",
    "user": "user",
    "password": "pass",
    "database": "app_db"
}

# TODO

def test():
    connection = None
    try:
        connection = pymysql.connect(**db_config, cursorclass=pymysql.cursors.DictCursor)
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO alerts (severity) VALUES ('DEBUG');")
            result = cursor.fetchall()
        print(str(result))
        return
    except Exception as e:
        print(str(e))
        return
    finally:
        if connection:
            connection.close()

while(True):
    time.sleep(5)
    test()