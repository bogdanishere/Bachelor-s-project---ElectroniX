from flask import jsonify
import mysql.connector
from mysql.connector import Error


def showProducts(db_config, page_number, sort_order):
    connection = None
    
    try:
        items_per_page = 8
        page = int(page_number)
        offset = (page - 1) * items_per_page
        connection = mysql.connector.connect(**db_config)
        
        query = "SELECT * FROM product"
        if sort_order in ['asc', 'desc']:
            query += " ORDER BY price {}".format(sort_order)
        else:
            query += " ORDER BY quality DESC"
        
        query += " LIMIT %s OFFSET %s"
        
        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query, (items_per_page, offset))
            rows = cursor.fetchall()
            return jsonify(rows), 200
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection is not None and connection.is_connected():
            cursor.close()
            connection.close()




