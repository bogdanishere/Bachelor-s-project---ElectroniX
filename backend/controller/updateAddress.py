from flask import  jsonify, request
import mysql.connector
from mysql.connector import Error

def update_address(db_config, client_username):
    data = request.json  

    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        update_query = """
        UPDATE Address
        SET street = %s, city = %s, state = %s, country = %s, postal_code = %s
        WHERE client_username = %s
        """
        cursor.execute(update_query, (data['street'], data['city'], data['state'], data['country'], data['postalCode'], client_username))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'message': 'Adresa nu a fost găsită sau nu a necesitat actualizare.'}), 404

        return jsonify({'message': 'Adresa a fost actualizată cu succes!'}), 200

    except Error as e:
        return jsonify({'error': f"Eroare la actualizarea adresei: {str(e)}"}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()