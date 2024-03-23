from flask import  jsonify
import mysql.connector
from mysql.connector import Error


def showProviders(db_config):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT prices_merchant FROM product")
            rows = cursor.fetchall()
            return jsonify(rows), 200
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection is not None and connection.is_connected():
            cursor.close()
            connection.close()