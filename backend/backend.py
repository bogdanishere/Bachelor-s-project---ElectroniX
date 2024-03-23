from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS
import stripe



import json
import os
from datetime import datetime
from werkzeug.utils import secure_filename
import base64
import uuid
from decimal import Decimal



from controller.showProducts import showProducts
from controller.showProviders import showProviders
from controller.addClient import addClient
from controller.loginClient import loginClient
from controller.checkAddressExists import check_address_exists
from controller.updateAddress import update_address
from controller.addAddress import add_address
from controller.getAddress import get_address
from controller.addCommand import add_command
from controller.deleteOrderByEmployee import delete_order_by_employee
from controller.confirmEmployee import confirm_employee
from controller.deleteOrderByProvider import delete_order_by_provider
from controller.confirmProvider import confirm_provider
from controller.showOrders import show_orders
from controller.showOrderDetails import show_order_details
from controller.showProductsByName import showProductsByName
from controller.showProductByNameID import showProductByNameID

UPLOAD_FOLDER = '/backend'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# app.config['MAX_CONTENT_LENGTH'] = 16*1024*1024*1024

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

BACKEND_FOLDER = os.path.join(os.getcwd(), 'backend')

if not os.path.exists(BACKEND_FOLDER):
    os.makedirs(BACKEND_FOLDER)

CORS(app)

db_config = {
    'user': 'root',
    'password': 'manager',
    'host': 'localhost',
    'database': 'electronix',
    'port': '3308',
}

def connect_to_database(config):
    try:
        connection = mysql.connector.connect(**config)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None




IMAGE_DIR = os.path.join(os.getcwd(), 'backend', 'images')
if not os.path.exists(IMAGE_DIR):
    os.makedirs(IMAGE_DIR)


stripe.api_key = "sk_test_51Ow1Qg00IzukxrMJ1tHjjSbe43YsSjkfeGSN8KZJyxyr8nM6eAxH4mRBkloPBxOsJQ9VZzWEoa9O7XQjjxVkVfYs00vHyVh2nI"


# @app.route('/checkout', methods=['POST'])
# def create_checkout_session():
#     data = request.json
#     price = data.get('price')
#     currency = data.get('currency') 

#     try:
#         session = stripe.checkout.Session.create(
#             line_items=[
#                 {
#                     'price_data': {
#                         'currency': currency,
#                         'product_data': {
#                             'name': 'Plata Produse',
#                         },
#                         'unit_amount': int(price) * 100,  
#                     },
#                     'quantity': 1,
#                 },
#             ],
#             mode='payment',
#             success_url='http://localhost:5173/',
#             cancel_url='http://localhost:5173/',
#         )
#         return jsonify({'url': session.url})
#     except Exception as e:
#         return jsonify(error=str(e)), 500


@app.route('/review', methods=['POST'])
def review():
    data = request.json
    product_id = data['product_id']
    rating = data['rating']
    review = data['review']
    client_username = data['username']
    title = data['title']
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("INSERT INTO new_rating (product_id, rating, review, client_username, title) VALUES (%s, %s, %s,%s,%s)", (product_id, rating, review, client_username, title))
        connection.commit()
        return jsonify({'message': 'Recenzia a fost adăugată cu succes!'}), 201
    except Error as e:
        return jsonify({'error': f'Eroare la adăugarea recenziei: {str(e)}'}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()

@app.route('/get_review/<string:product_id>', methods=['GET'])
def get_review(product_id):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM new_rating WHERE product_id = %s", (product_id,))
        result = cursor.fetchall()
        return jsonify(result), 200
    except Error as e:
        return jsonify({'error': f'Eroare la preluarea recenziilor: {str(e)}'}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()


@app.route('/add_new_product', methods=['POST'])
def add_new_product():
    connection = connect_to_database(db_config)
    if connection is None:
        return jsonify({'error': 'Cannot connect to database'}), 500

    try:
        data = request.json
        cursor = connection.cursor()

        # Generăm un UUID pentru product_id
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

        # Execute the query
        cursor.execute(add_product_query, values)

        # Commit the transaction
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

@app.route('/test/getImages', methods=['GET'])
def get_images():
    connection = connect_to_database(db_config)
    if connection is None:
        return jsonify({'error': 'Cannot connect to database'}), 500

    try:
        cursor = connection.cursor()
        cursor.execute("SELECT imageURLs FROM test_product")
        result = cursor.fetchall()
        image_urls = [row[0] for row in result]
        cursor.close()
        connection.close()
        return jsonify({'imageURLs': image_urls}), 200
    except Error as e:
        return jsonify({'error': f'Error retrieving image URLs: {str(e)}'}), 500




@app.route('/product/<page_number>', methods=['GET'])
def get_showProducts(page_number):
    sort_order = request.args.get('sort', default='none', type=str)
    return showProducts(db_config, page_number, sort_order)


@app.route('/product/<name>/<page_number>', methods=['GET'])
def get_showProductsByName(name, page_number):
    sort_order = request.args.get('sort', 'none')
    return showProductsByName(db_config, name, page_number, sort_order)

@app.route('/product/product/name/<id_product>', methods=['GET'])
def get_showProductsByNameID( id_product):
    return showProductByNameID(db_config, id_product)


@app.route('/providers', methods=['GET'])
def get_showProviders():
    return showProviders(db_config)


@app.route('/add_client', methods=['POST'])
def get_addClient():
    return addClient(db_config)


@app.route('/login', methods=['POST'])
def get_loginClient():
    return loginClient(db_config)


@app.route('/check_address/<string:client_username>', methods=['GET'])
def get_check_address_exists(client_username):
    return check_address_exists(db_config, client_username)


@app.route('/update_address/<string:client_username>', methods=['PUT'])
def get_update_address(client_username):
    return update_address(db_config, client_username)


@app.route('/address', methods=['POST'])
def get_add_address():
    return add_address(db_config)

@app.route('/get_address/<string:client_username>', methods=['GET'])
def get_get_address(client_username):
    return get_address(db_config, client_username)


@app.route('/add_command', methods=['POST'])
def get_add_command():
    return add_command(db_config)


@app.route('/delete_order/<int:order_id>', methods=['DELETE'])
def get_delete_order_by_employee(order_id):
    return delete_order_by_employee(db_config, order_id)


@app.route('/confirm_employee/<int:order_id>', methods=['POST'])
def get_confirm_employee(order_id):
    return confirm_employee(db_config, order_id)


@app.route('/delete_order_by_provider/<int:order_detail_id>/<int:order_id>', methods=['DELETE'])
def get_delete_order_by_provider(order_detail_id, order_id):
    return delete_order_by_provider(db_config, order_detail_id, order_id)


@app.route('/confirm_provider/<int:order_detail_id>', methods=['POST'])
def get_confirm_provider(order_detail_id):
    return confirm_provider(db_config, order_detail_id)


@app.route('/show_orders', methods=['GET'])
def get_show_orders():
    return show_orders(db_config)


@app.route('/show_order_details/<string:provider_name>', methods=['GET'])
def get_show_order_details(provider_name):
    return show_order_details(db_config, provider_name)



@app.route('/modify_quantity', methods=['POST'])
def modifyQuantityProduct():
    data = request.json
    product_id = data['product_id']
    quantity_to_subtract = data['quantity_to_subtract']
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT quantity FROM Product WHERE product_id = %s", (product_id,))
        result = cursor.fetchone()
        if result:
            current_quantity = result['quantity']
            new_quantity = max(current_quantity - quantity_to_subtract, 0)
            cursor.execute("UPDATE Product SET quantity = %s WHERE product_id = %s", (new_quantity, product_id))
            connection.commit()
            return jsonify({'message': 'Cantitatea a fost actualizată cu succes!'}), 200
        else:
            return jsonify({'error': 'Produsul nu a fost găsit.'}), 404
    except Error as e:
        return jsonify({'error': f"Eroare la actualizarea cantității: {str(e)}"}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()



if __name__ == '__main__':
    app.run(host='192.168.0.203', port=8005, debug=True)
