from flask import  jsonify
import mysql.connector
from mysql.connector import Error
import uuid


def add_new_product(db_config, data):
    connection = mysql.connector.connect(**db_config)

    if connection is None:
        return jsonify({'error': 'Cannot connect to database'}), 500

    try:
        cursor = connection.cursor()
        product_id = str(uuid.uuid4())
        price = str(data['price'])
        weight = str(data['weight'])



        add_product_query = (
            "INSERT INTO product (product_id, price, currency, weight, name, brand, quantity, "
            "prices_availability, prices_condition, prices_merchant, prices_sourceURLs, categories, "
            "dateAdded, dateUpdated, imageURLs, sourceURLs, rating, nr_rating, description) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        )

        values = (product_id, price, data['currency'], weight, data['name'], data['brand'], data['quantity'],
                  data['prices_availability'], data['prices_condition'], data['prices_merchant'], data['prices_sourceURLs'],
                  data['categories'], data['dateAdded'], data['dateUpdated'], data['imageURLs'], data['sourceURLs'],
                  data['rating'], data['nr_rating'], data['description'])

        cursor.execute(add_product_query, values)

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({'message': 'Product added successfully'}), 201

    except Exception as e:
        print(e)
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
        return jsonify({'error': f'Error adding product: {str(e)}'}), 500