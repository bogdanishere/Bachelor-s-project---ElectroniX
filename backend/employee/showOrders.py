from flask import  jsonify
import mysql.connector
from mysql.connector import Error

def show_orders(db_config):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM `Order` WHERE employee_approved = FALSE")
        orders = cursor.fetchall()
        return jsonify(orders), 200
    except Error as e:
        return jsonify({'error': f"Eroare la afișarea comenzilor: {str(e)}"}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()