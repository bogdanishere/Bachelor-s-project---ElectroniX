from flask import  jsonify
import mysql.connector
from mysql.connector import Error




def confirm_employee(db_config, order_id):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("UPDATE `Order` SET employee_approved = %s WHERE order_id = %s", (True, order_id))
        connection.commit()
        
        if cursor.rowcount == 0:
            return jsonify({'message': 'Nicio comandă nu a fost actualizată.'}), 404
        
        return jsonify({'message': 'Aprobarea angajatului a fost confirmată cu succes!'}), 200

    except Error as e:
        return jsonify({'error': f"Eroare la confirmarea aprobării angajatului: {str(e)}"}), 500

    finally:
        if connection is not None and connection.is_connected():
            cursor.close()
            connection.close()