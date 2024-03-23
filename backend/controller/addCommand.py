from flask import  jsonify, request
import mysql.connector
from mysql.connector import Error

def add_command(db_config):
    data = request.json
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    response = {}
    
    try:
        cursor.execute("INSERT INTO `Order` (address_id, employee_username, employee_approved) VALUES (%s, %s, %s)",
                       (data['address_id'], data['employee_username'], False))
        order_id = cursor.lastrowid  
        
        for product in data['products']:  
            cursor.execute("INSERT INTO OrderDetails (order_id, product_id, provider_username, quantity, provider_approved) VALUES (%s, %s, %s, %s, %s)",
                           (order_id, product['product_id'], product['provider_username'], product['quantity'], False))
        
        connection.commit()
        response['message'] = 'Command added successfully!'
        return jsonify(response), 201

    except Error as e:
        connection.rollback()  # Important to rollback in case of error
        response['error'] = f"Error adding new command: {e}"
        return jsonify(response), 500

    finally:
        cursor.close()
        connection.close()