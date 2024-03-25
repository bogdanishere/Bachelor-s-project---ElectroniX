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



from client.showProducts import showProducts
from controller.showProviders import showProviders
from client.addClient import addClient
from client.loginClient import loginClient
from client.checkAddressExists import check_address_exists
from controller.updateAddress import update_address
from client.addAddress import add_address
from client.getAddress import get_address
from client.addCommand import add_command
from employee.deleteOrderByEmployee import delete_order_by_employee
from employee.confirmEmployee import confirm_employee
from provider.deleteOrderByProvider import delete_order_by_provider
from provider.confirmProvider import confirm_provider
from employee.showOrders import show_orders
from provider.showOrderDetails import show_order_details
from client.showProductsByName import showProductsByName
from controller.showProductByNameID import showProductByNameID
from provider.addNewProduct import add_new_product
from client.addReview import add_review
from client.getReview import get_review
from client.verifyPayment import verify_payment
from client.checkoutStripe import create_checkout_session
from client.findAddress import findAddress

import jwt

# UPLOAD_FOLDER = '/backend'
# ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


app = Flask(__name__)


CORS(app)
app.config['PROPAGATE_EXCEPTIONS'] = True


db_config = {
    'user': 'root',
    'password': 'manager',
    'host': 'localhost',
    'database': 'electronix2',
    'port': '3308',
}

# def connect_to_database(config):
#     try:
#         connection = mysql.connector.connect(**config)
#         if connection.is_connected():
#             return connection
#     except Error as e:
#         print(f"Error while connecting to MySQL: {e}")
#         return None





stripe.api_key = "sk_test_51Ow1Qg00IzukxrMJ1tHjjSbe43YsSjkfeGSN8KZJyxyr8nM6eAxH4mRBkloPBxOsJQ9VZzWEoa9O7XQjjxVkVfYs00vHyVh2nI"




@app.route('/verify_token', methods=['POST'])
def verify_token():
    SECRET_KEY = "asdgfdagHSDHUFDS09fdss"
    data = request.get_json()
    token = data.get('token1')
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM User WHERE username = %s", (decoded['username'],))
        user = cursor.fetchone()

        print(user)
        print(decoded['username'])

        if user:
            return jsonify({'username': user['username'], 'type': user['type']}), 200
        else:
            return jsonify({'error': 'User not found', 'decoded': decoded['username']}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:

        return jsonify({'error': 'Invalid token'}), 401
    except Error as e:

        return jsonify({'error': str(e)}), 500


@app.route('/checkout', methods=['POST'])
def post_checkout():
    data = request.json
    return create_checkout_session(data)
    


@app.route('/verify_payment/<session_id>', methods=['GET'])
def get_verify_payment(session_id):
    return verify_payment(session_id)



@app.route('/review', methods=['POST'])
def post_review():
    data = request.json
    return add_review(db_config, data)


@app.route('/get_review/<string:product_id>', methods=['GET'])
def get_get_review(product_id):
    return get_review(product_id, db_config)


@app.route('/add_new_product', methods=['POST'])
def post_add_new_product():
    data = request.json
    return add_new_product(db_config, data)




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
    data = request.json
    return addClient(db_config, data)


@app.route('/login', methods=['POST'])
def get_loginClient():
    data = request.json
    return loginClient(db_config, data)


@app.route('/check_address/<string:client_username>', methods=['GET'])
def get_check_address_exists(client_username):
    return check_address_exists(db_config, client_username)


@app.route('/findAddress/<string:client_username>', methods=['GET'])
def get_findAddress(client_username):
    return findAddress(client_username, db_config)



@app.route('/update_address/<string:client_username>', methods=['PUT'])
def get_update_address(client_username):
    return update_address(db_config, client_username)


@app.route('/address', methods=['POST'])
def get_add_address():
    data = request.json
    return add_address(db_config, data)

@app.route('/get_address/<string:client_username>', methods=['GET'])
def get_get_address(client_username):
    return get_address(db_config, client_username)


@app.route('/add_command', methods=['POST'])
def get_add_command():
    data = request.json
    return add_command(db_config, data)


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



if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8005, debug=True)
