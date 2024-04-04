from flask import Flask, request
from flask_cors import CORS


from client.showProducts import showProducts
from client.addReview import add_review
from client.getReview import get_review
from client.verifyPayment import verify_payment
from client.checkoutStripe import create_checkout_session
from client.findAddress import findAddress
from client.addClient import addClient
from client.loginClient import loginClient
from client.checkAddressExists import check_address_exists
from client.addAddress import add_address
from client.getAddress import get_address
from client.addCommand import add_command
from client.showProductsByName import showProductsByName


from employee.showOrders import show_orders
from employee.deleteOrderByEmployee import delete_order_by_employee
from employee.confirmEmployee import confirm_employee

from provider.deleteOrderByProvider import delete_order_by_provider
from provider.confirmProvider import confirm_provider
from provider.showOrderDetails import show_order_details
from provider.addNewProduct import add_new_product


from verifyToken import verify_token

from controller.showProductByNameID import showProductByNameID
from controller.showProviders import showProviders
from controller.updateAddress import update_address
from recomandationSystemKnn import list_products

from flask import  jsonify, request
import mysql.connector
from mysql.connector import Error

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


@app.route('/recomandationSystem', methods=['POST'])
def recomandationSystem():
    data = request.get_json()
    ids = data.get('ids')
    
    if not ids:
        return jsonify({"error": "No product IDs provided"}), 400
    
    recommended_ids_dicts = list_products(ids)

    all_recommended_ids = {rec_id for rec_dict in recommended_ids_dicts for rec_id in rec_dict['recommendations']}

    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)

    recommended_products = []

    for product_id in all_recommended_ids:
        query = 'SELECT * FROM product WHERE product_id = %s'
        cursor.execute(query, (product_id,))
        fetch = cursor.fetchone()
        if fetch:  
            recommended_products.append(fetch)

    cursor.close()
    connection.close()

    return jsonify(recommended_products), 200




@app.route('/searchFinishedOrders/<string:user>', methods=['GET'])
def searchFinishedOrders(user):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        update_query = """
        UPDATE orderdetails od
        JOIN `order` o ON od.order_id = o.order_id
        SET od.status = 'livrată'
        WHERE od.arrival_time <= NOW() AND od.status != 'livrată' AND od.status != 'in pregatire' AND o.client_username = %s
        """
        cursor.execute(update_query, (user,))
        
        connection.commit()

        query = """
        SELECT 
            o.order_id, 
            o.client_username, 
            o.date_created, 
            o.employee_approved,
            od.quantity, 
            p.product_id, 
            p.name AS product_name, 
            p.brand, 
            p.price, 
            p.currency, 
            p.imageURLs,
            a.street, 
            a.city, 
            a.state, 
            a.country, 
            a.postal_code, 
            a.address_type,
            od.provider_approved,
            o.employee_username,
            od.status,
            CASE
                WHEN od.status != 'in pregatire' THEN od.arrival_time
                ELSE NULL
            END AS arrival_time
        FROM `order` o
        JOIN `orderdetails` od ON o.order_id = od.order_id
        JOIN `product` p ON od.product_id = p.product_id
        JOIN `address` a ON o.address_id = a.address_id
        WHERE o.client_username = %s
        """

        cursor.execute(query, (user,))
        result = cursor.fetchall()

        return jsonify(result), 200
    except Error as e:
        return jsonify({'error': f'Eroare la preluarea comenzilor finalizate: {str(e)}'}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()




@app.route('/brand-count/<int:number>', methods=['GET'])
def show_brand_count(number):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT brand, COUNT(*) AS numar_produse FROM product GROUP BY brand ORDER BY numar_produse DESC LIMIT %s", (number,))
        result = cursor.fetchall()
        return jsonify(result), 200
    except Error as e:
        return jsonify({'error': f'Eroare la preluarea numărului de produse pe brand: {str(e)}'}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()


@app.route('/deleteProductsByProvider', methods=['DELETE'])
def deleteProductsByProvider():
    data = request.get_json()
    product_id = data['product_id']
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("DELETE FROM product WHERE product_id = %s", (product_id,))
        connection.commit()
        return jsonify({'message': 'Produsul a fost sters cu succes!'}), 200
    except Error as e:
        return jsonify({'error': f'Eroare la stergerea produsului: {str(e)}'}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()

@app.route('/showProductsByProductName/<string:name>/<int:page>', methods=['GET'])
def showProductsByProductName(name, page):
    connection = None
    items_per_page = 8
    offset = (page - 1) * items_per_page

    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM product WHERE prices_merchant = %s LIMIT %s OFFSET %s", (name, items_per_page, offset,))
        result = cursor.fetchall()
        return jsonify(result), 200
    except Error as e:
        return jsonify({'error': f'Eroare la preluarea produselor: {str(e)}'}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()


@app.route('/verify_token', methods=['POST'])
def post_verify_token():
    data = request.get_json()
    return verify_token(data, db_config)


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

@app.route('/product/product/name/<product_id>', methods=['GET'])
def get_showProductsByNameID( product_id):
    return showProductByNameID(db_config, product_id)


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
