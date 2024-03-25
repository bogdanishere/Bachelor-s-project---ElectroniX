from flask import  jsonify, request
import mysql.connector
from mysql.connector import Error

def findAddress(client_username, db_config):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("SELECT client_username, street, city, state, country, postal_code FROM address WHERE client_username = %s", (client_username,))
        
        result = cursor.fetchone()
        
        if result:
            return jsonify(result), 200
        else:
            return jsonify({'error': 'Adresa nu a fost găsită.'}), 404
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()