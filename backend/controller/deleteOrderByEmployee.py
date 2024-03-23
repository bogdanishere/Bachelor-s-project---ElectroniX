from flask import  jsonify
import mysql.connector
from mysql.connector import Error

def delete_order_by_employee(db_config, order_id):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)        
        cursor.execute("DELETE FROM orderdetails WHERE order_id = %s", (order_id,))
        cursor.execute("DELETE FROM `Order` WHERE order_id = %s", (order_id,))
        connection.commit()
        
        if cursor.rowcount == 0:
            return jsonify({'message': 'Nicio comandă nu a fost găsită pentru a fi ștearsă.'}), 404
        
        return jsonify({'message': 'Comanda a fost ștearsă cu succes!'}), 200

    except Error as e:
        return jsonify({'error': f"Eroare la ștergerea comenzii: {str(e)}"}), 500

    finally:
        if connection is not None and connection.is_connected():
            cursor.close()
            connection.close()