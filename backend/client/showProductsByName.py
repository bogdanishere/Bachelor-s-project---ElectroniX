from flask import jsonify
import mysql.connector
from mysql.connector import Error



def showProductsByName(db_config, name, page_number, sort_order):
    try:
        items_per_page = 8
        page = int(page_number)
        offset = (page - 1) * items_per_page
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        
        base_sql = "SELECT * FROM product WHERE MATCH(name, categories) AGAINST(%s IN NATURAL LANGUAGE MODE)"
        
        if sort_order == 'asc':
            order_sql = " ORDER BY price ASC"
        elif sort_order == 'desc':
            order_sql = " ORDER BY price DESC"
        else:
            order_sql = ""  
        
        final_sql = f"{base_sql}{order_sql} LIMIT %s OFFSET %s"
        
        cursor.execute(final_sql, (name, items_per_page, offset))
        rows = cursor.fetchall()
        return jsonify(rows), 200
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if 'cursor' in locals() and cursor is not None:
            cursor.close()
        if 'connection' in locals() and connection is not None and connection.is_connected():
            connection.close()


