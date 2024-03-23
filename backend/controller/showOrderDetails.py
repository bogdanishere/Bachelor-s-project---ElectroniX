from flask import jsonify
import mysql.connector
from mysql.connector import Error

def show_order_details(db_config, provider_name):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT 
                orderdetails.order_detail_id,
                orderdetails.order_id,
                orderdetails.product_id,
                orderdetails.quantity,
                product.name AS product_name,
                `Order`.date_created,
                `Order`.employee_approved,
                provider_username
            FROM 
                orderdetails
            JOIN 
                product ON orderdetails.product_id = product.product_id
            JOIN 
                `Order` ON orderdetails.order_id = Order.order_id
            WHERE 
                orderdetails.provider_approved = FALSE
                AND `Order`.employee_approved = TRUE
                AND provider_username = %s
        """
        cursor.execute(query, (provider_name,))
        order_details = cursor.fetchall()
        return jsonify(order_details), 200
    except Error as e:
        return jsonify({'error': f"Error displaying order details: {str(e)}"}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()
