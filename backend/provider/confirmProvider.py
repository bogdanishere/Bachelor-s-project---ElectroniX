from flask import jsonify
import mysql.connector
from mysql.connector import Error

def confirm_provider(db_config, order_detail_id):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        cursor.execute("UPDATE OrderDetails SET provider_approved = %s WHERE order_detail_id = %s", (True, order_detail_id))
        
        cursor.execute("SELECT product_id, quantity FROM OrderDetails WHERE order_detail_id = %s", (order_detail_id, ))
        order_detail = cursor.fetchone()

        if order_detail:
            product_id = order_detail['product_id']
            ordered_quantity = order_detail['quantity']

            cursor.execute("""
                UPDATE Product
                SET quantity = quantity - %s
                WHERE product_id = %s
            """, (ordered_quantity, product_id))

            if cursor.rowcount == 0:
                connection.rollback()  
                return jsonify({'message': 'Produsul nu a fost găsit sau cantitatea nu a putut fi actualizată.'}), 404
        else:
            return jsonify({'message': 'Detaliile comenzii nu au fost găsite.'}), 404
        
        connection.commit() 
        return jsonify({'message': 'Aprobarea furnizorului și actualizarea cantității produsului au fost confirmate cu succes!'}), 200

    except Error as e:
        if connection:
            connection.rollback()
        return jsonify({'error': f"Eroare la confirmarea aprobării furnizorului și la actualizarea cantității produsului: {str(e)}"}), 500

    finally:
        if connection is not None and connection.is_connected():
            cursor.close()
            connection.close()
