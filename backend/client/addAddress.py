from flask import  jsonify, request
import mysql.connector
from mysql.connector import Error

def add_address(db_config, data):
    try:
        # Conectarea la baza de date
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        
        
        # Crearea și executarea interogării SQL pentru inserarea adresei
        insert_query = """
        INSERT INTO Address (client_username, street, city, state, country, postal_code)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (data['clientUsername'], data['street'], data['city'], data['state'], data['country'], data['postalCode']))
        connection.commit() 
        
        return jsonify({'message': 'Adresa a fost adăugată cu succes!'}), 201
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()