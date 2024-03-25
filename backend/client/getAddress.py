from flask import  jsonify, request
import mysql.connector
from mysql.connector import Error

def get_address(db_config, client_username):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Address WHERE client_username = %s", (client_username,))
        
        addresses = cursor.fetchall()
        
        if not addresses:
            return jsonify({'message': 'Nu s-au găsit adrese pentru utilizatorul specificat.'}), 404
        
        return jsonify(addresses), 200
    except Error as e:
        return jsonify({'error': f"Eroare la obținerea adreselor: {str(e)}"}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()