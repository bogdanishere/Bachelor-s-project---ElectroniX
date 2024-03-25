from flask import jsonify, request
import mysql.connector
from mysql.connector import Error

def add_command(db_config, data):

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    response = {}
    
    try:
        # Mai întâi obține client_username bazat pe address_id
        cursor.execute("SELECT client_username FROM address WHERE address_id = %s", (data['address_id'],))
        client_record = cursor.fetchone()
        
        if client_record:
            client_username = client_record['client_username']
            
            # Acum inserăm în tabelul `Order`
            cursor.execute("INSERT INTO `Order` (address_id, client_username, employee_username, employee_approved) VALUES (%s, %s, %s, %s)",
                           (data['address_id'], client_username, data['employee_username'], False))
            order_id = cursor.lastrowid  
            
            # Inserăm acum fiecare produs în OrderDetails
            for product in data['products']:  
                cursor.execute("INSERT INTO OrderDetails (order_id, product_id, provider_username, quantity, provider_approved) VALUES (%s, %s, %s, %s, %s)",
                               (order_id, product['product_id'], product['provider_username'], product['quantity'], False))
            
            connection.commit()
            response['message'] = 'Command added successfully!'
            return jsonify(response), 201
        else:
            response['error'] = "No client associated with the provided address_id."
            return jsonify(response), 404

    except Error as e:
        connection.rollback()  # Important to rollback in case of error
        response['error'] = f"Error adding new command: {e}"
        return jsonify(response), 500

    finally:
        cursor.close()
        connection.close()
