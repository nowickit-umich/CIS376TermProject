import time
import pymysql
import os

db_config = {
    "host": "database",
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASS"),
    "database": os.getenv("DB_NAME")
}

# TODO

def test():
    connection = None
    try:
        connection = pymysql.connect(**db_config, cursorclass=pymysql.cursors.DictCursor)
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO alerts (severity) VALUES ('DEBUG');")
            result = cursor.fetchall()
        connection.commit()
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