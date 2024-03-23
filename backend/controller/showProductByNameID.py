from flask import jsonify
import mysql.connector
from mysql.connector import Error

def showProductByNameID(db_config, id_product):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        sql_query = "SELECT * FROM product WHERE product_id = %s"
        cursor.execute(sql_query, (id_product,))
        row = cursor.fetchone()  
        
        if row:
            return jsonify(row), 200 
        else:
            return jsonify({'message': 'Product not found'}), 404  # Sau un mesaj adecvat când produsul nu este găsit
        
    except Error as e:
        return jsonify({'error': str(e)}), 500

