from flask import  jsonify, request
import mysql.connector
from mysql.connector import Error

def get_review(product_id, db_config):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM new_rating WHERE product_id = %s", (product_id,))
        result = cursor.fetchall()
        return jsonify(result), 200
    except Error as e:
        return jsonify({'error': f'Eroare la preluarea recenziilor: {str(e)}'}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()