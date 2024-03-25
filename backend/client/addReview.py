from flask import  jsonify, request
import mysql.connector
from mysql.connector import Error

def add_review(db_config, data):
    
    product_id = data['product_id']
    new_rating = data['rating']  # Asumăm că acesta este un float
    review = data['review']
    client_username = data['username']
    title = data['title']

    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)


        cursor.execute("""
            INSERT INTO new_rating (client_username, product_id, rating, review, title)
            VALUES (%s, %s, %s, %s, %s)
        """, (client_username, product_id, new_rating, review, title))

        cursor.execute("""
            SELECT nr_rating, rating FROM product WHERE product_id = %s
        """, (product_id,))
        product = cursor.fetchone()

        if product:
            media_curenta = product['rating'] or 0  
            nr_rating_curent = product['nr_rating'] or 0
            noua_medie = ((media_curenta * nr_rating_curent) + new_rating) / (nr_rating_curent + 1)

            cursor.execute("""
                UPDATE product SET rating = %s, nr_rating = nr_rating + 1 WHERE product_id = %s
            """, (noua_medie, product_id))

        connection.commit()
        return jsonify({'message': 'Recenzia a fost adăugată cu succes!'}), 201

    except mysql.connector.Error as e:
        if connection:
            connection.rollback()
        return jsonify({'error': 'Eroare la adăugarea recenziei: {}'.format(str(e))}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
