from flask import  jsonify
import mysql.connector
from mysql.connector import Error

def check_address_exists(db_config, client_username):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Address WHERE client_username = %s", (client_username,))
        address = cursor.fetchone()
        
        if address:
            return jsonify({'exists': True, 'address': address}), 200
        else:
            return jsonify({'exists': False, 'message': 'Adresa pentru acest utilizator nu există.'}), 404
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()