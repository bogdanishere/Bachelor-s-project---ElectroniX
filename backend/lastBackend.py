from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS
from controller.showProducts import showProducts
app = Flask(__name__)
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


@app.route('/products', methods=['GET'])
def get_showProducts():
    return showProducts()
# def showProducts():
#     connection = None
#     try:
#         connection = mysql.connector.connect(**db_config)
#         if connection.is_connected():
#             cursor = connection.cursor(dictionary=True)
#             cursor.execute("SELECT * FROM product")
#             rows = cursor.fetchall()
#             return jsonify(rows), 200
#     except Error as e:
#         return jsonify({'error': str(e)}), 500
#     finally:
#         if connection is not None and connection.is_connected():
#             cursor.close()
#             connection.close()


@app.route('/providers', methods=['GET'])
def showProviders():
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT prices_merchant FROM product")
            rows = cursor.fetchall()
            return jsonify(rows), 200
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection is not None and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/add_client', methods=['POST'])
def addClient():
    data = request.json
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    response = {}
    
    try:
        cursor.execute("SELECT * FROM User WHERE username = %s", (data['username'],))
        if cursor.fetchone():
            response['message'] = 'Client already exists!'
            return jsonify(response), 400
    except Error as e:
        response['error'] = f"Error checking existing user: {e}"
        return jsonify(response), 500
    else:
        try:
            cursor.execute("INSERT INTO User (username, password, email, type) VALUES (%s, %s, %s, %s)", 
                           (data['username'], data['password'], data['email'], 'client'))
            cursor.execute("INSERT INTO Client (username, first_name, last_name) VALUES (%s, %s, %s)", 
                           (data['username'], data['firstName'], data['lastName']))
            connection.commit()
            response['message'] = 'Client added successfully!'
            response['user'] = data['username']
            return jsonify(response), 201
        except Error as e:
            response['error'] = f"Error adding new client: {e}"
            return jsonify(response), 500
    finally:
        cursor.close()
        connection.close()


        
@app.route('/login', methods=['POST'])
def loginClient():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM User WHERE email = %s AND password = %s", (email, password))
        user = cursor.fetchone()

        if user:
            # Utilizator autentificat cu succes
            return jsonify({'message': f"{user['type'].capitalize()} logat!", 'user': user['username']}), 200
        else:
            # Eșec la autentificare
            return jsonify({'error': 'Email sau parola gresita!'}), 401

    except Error as e:
        # Eroare la executarea interogării
        return jsonify({'error': f"Eroare la autentificare: {str(e)}"}), 500

    finally:
        if connection is not None and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/check_address/<string:client_username>', methods=['GET'])
def check_address_exists(client_username):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Address WHERE client_username = %s", (client_username,))
        address = cursor.fetchone()
        
        if address:
            return jsonify({'exists': True, 'address': address}), 200
        else:
            return jsonify({'exists': False, 'message': 'Adresa pentru acest utilizator nu există.'}), 404
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/update_address/<string:client_username>', methods=['PUT'])
def update_address(client_username):
    data = request.json  # Obținerea datelor trimise de client

    try:
        # Conectarea la baza de date
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Actualizarea adresei în baza de date
        update_query = """
        UPDATE Address
        SET street = %s, city = %s, state = %s, country = %s, postal_code = %s
        WHERE client_username = %s
        """
        cursor.execute(update_query, (data['street'], data['city'], data['state'], data['country'], data['postalCode'], client_username))
        connection.commit()

        if cursor.rowcount == 0:
            # Dacă nicio adresă nu a fost actualizată, înseamnă că utilizatorul nu are o adresă înregistrată
            return jsonify({'message': 'Adresa nu a fost găsită sau nu a necesitat actualizare.'}), 404

        return jsonify({'message': 'Adresa a fost actualizată cu succes!'}), 200

    except Error as e:
        return jsonify({'error': f"Eroare la actualizarea adresei: {str(e)}"}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

    

@app.route('/address', methods=['POST'])
def add_address():
    data = request.json  # Obținerea datelor trimise de client
    
    try:
        # Conectarea la baza de date
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        
        
        # Crearea și executarea interogării SQL pentru inserarea adresei
        insert_query = """
        INSERT INTO Address (client_username, street, city, state, country, postal_code)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (data['clientUsername'], data['street'], data['city'], data['state'], data['country'], data['postalCode']))
        connection.commit()  # Confirmarea tranzacției
        
        return jsonify({'message': 'Adresa a fost adăugată cu succes!'}), 201
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/get_address/<string:client_username>', methods=['GET'])
def get_address(client_username):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Address WHERE client_username = %s", (client_username,))
        
        addresses = cursor.fetchall()
        
        if not addresses:
            # Dacă nu sunt găsite adrese, returnează un obiect gol sau un mesaj specific.
            return jsonify({'message': 'Nu s-au găsit adrese pentru utilizatorul specificat.'}), 404
        
        return jsonify(addresses), 200
    except Error as e:
        return jsonify({'error': f"Eroare la obținerea adreselor: {str(e)}"}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()


@app.route('/add_command', methods=['POST'])
def add_command():
    data = request.json
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    response = {}
    
    try:
        cursor.execute("INSERT INTO `Order` (address_id, employee_username, employee_approved) VALUES (%s, %s, %s)",
                       (data['address_id'], data['employee_username'], False))
        order_id = cursor.lastrowid  # Retrieve the ID of the newly inserted order
        
        # Insert into OrderDetails. Assuming provider_username is part of the data for each product
        # If multiple products need to be added, iterate through a list of products in data
        for product in data['products']:  # Assuming data['products'] is a list of product details
            cursor.execute("INSERT INTO OrderDetails (order_id, product_id, provider_username, quantity, provider_approved) VALUES (%s, %s, %s, %s, %s)",
                           (order_id, product['product_id'], product['provider_username'], product['quantity'], False))
        
        connection.commit()
        response['message'] = 'Command added successfully!'
        return jsonify(response), 201

    except Error as e:
        connection.rollback()  # Important to rollback in case of error
        response['error'] = f"Error adding new command: {e}"
        return jsonify(response), 500

    finally:
        cursor.close()
        connection.close()


@app.route('/delete_order/<int:order_id>', methods=['DELETE'])
def delete_order_by_employee(order_id):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)        
        cursor.execute("DELETE FROM orderdetails WHERE order_id = %s", (order_id,))
        cursor.execute("DELETE FROM `Order` WHERE order_id = %s", (order_id,))
        connection.commit()
        
        if cursor.rowcount == 0:
            return jsonify({'message': 'Nicio comandă nu a fost găsită pentru a fi ștearsă.'}), 404
        
        return jsonify({'message': 'Comanda a fost ștearsă cu succes!'}), 200

    except Error as e:
        return jsonify({'error': f"Eroare la ștergerea comenzii: {str(e)}"}), 500

    finally:
        if connection is not None and connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/confirm_employee/<int:order_id>', methods=['POST'])
def confirm_employee(order_id):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("UPDATE `Order` SET employee_approved = %s WHERE order_id = %s", (True, order_id))
        connection.commit()
        
        if cursor.rowcount == 0:
            return jsonify({'message': 'Nicio comandă nu a fost actualizată.'}), 404
        
        return jsonify({'message': 'Aprobarea angajatului a fost confirmată cu succes!'}), 200

    except Error as e:
        return jsonify({'error': f"Eroare la confirmarea aprobării angajatului: {str(e)}"}), 500

    finally:
        if connection is not None and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/delete_order_by_provider/<int:order_id>', methods=['DELETE'])
def delete_order_by_provider(order_id):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("DELETE FROM OrderDetails WHERE order_id = %s", (order_id,))
        cursor.execute("DELETE FROM `Order` WHERE order_id = %s", (order_id,))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'message': 'Nicio comandă nu a fost găsită pentru a fi ștearsă.'}), 404

        return jsonify({'message': 'Comanda a fost ștearsă cu succes!'}), 200

    except Error as e:
        return jsonify({'error': f"Eroare la ștergerea comenzii: {str(e)}"}), 500

    finally:
        if connection is not None and connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/confirm_provider/<int:order_id>', methods=['POST'])
def confirm_provider(order_id):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("UPDATE OrderDetails SET provider_approved = %s WHERE order_id = %s", (True, order_id))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({'message': 'Nicio detaliu comandă nu a fost actualizat.'}), 404

        return jsonify({'message': 'Aprobarea furnizorului a fost confirmată cu succes!'}), 200

    except Error as e:
        return jsonify({'error': f"Eroare la confirmarea aprobării furnizorului: {str(e)}"}), 500

    finally:
        if connection is not None and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/modify_quantity', methods=['POST'])
def modifyQuantityProduct():
    data = request.json
    product_id = data['product_id']
    quantity_to_subtract = data['quantity_to_subtract']
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Obțineți cantitatea actuală a produsului
        cursor.execute("SELECT quantity FROM Product WHERE product_id = %s", (product_id,))
        result = cursor.fetchone()
        if result:
            current_quantity = result['quantity']
            # Scădeți cantitatea curentă cu valoarea dată
            new_quantity = max(current_quantity - quantity_to_subtract, 0)
            # Actualizați cantitatea în baza de date
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

@app.route('/show_orders', methods=['GET'])
def show_orders():
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM `Order` WHERE employee_approved = FALSE")
        orders = cursor.fetchall()
        return jsonify(orders), 200
    except Error as e:
        return jsonify({'error': f"Eroare la afișarea comenzilor: {str(e)}"}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()

@app.route('/show_order_details', methods=['GET'])
def show_order_details():
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM OrderDetails WHERE provider_approved = FALSE")
        order_details = cursor.fetchall()
        return jsonify(order_details), 200
    except Error as e:
        return jsonify({'error': f"Eroare la afișarea detaliilor comenzilor: {str(e)}"}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()


@app.route('/test_products', methods=['GET'])
def get_products():
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM test_products")
        products = cursor.fetchall()

        if products:
            # Produse găsite
            return jsonify({'products': products}), 200
        else:
            # Niciun produs găsit
            return jsonify({'message': 'Niciun produs gasit!'}), 404

    except Error as e:
        # Eroare la executarea interogării
        return jsonify({'error': f"Eroare la obtinerea produselor: {str(e)}"}), 500

    finally:
        if connection is not None and connection.is_connected():
            cursor.close()
            connection.close()
###############
            
            #### pentru mai tarziu ########

# @app.route('/confirm_provider/<int:order_id>', methods=['POST'])
# def confirm_provider(order_id):
#     connection = None
#     try:
#         connection = mysql.connector.connect(**db_config)
#         cursor = connection.cursor(dictionary=True)

#         # Verifică dacă comanda există și nu a fost încă aprobată de furnizor
#         cursor.execute("SELECT provider_approved FROM OrderDetails WHERE order_id = %s", (order_id,))
#         order_details = cursor.fetchall()

#         if not order_details or order_details[0]['provider_approved']:
#             return jsonify({'error': 'Comanda nu există sau a fost deja aprobată de furnizor.'}), 400

#         # Confirmă comanda în OrderDetails
#         cursor.execute("UPDATE OrderDetails SET provider_approved = TRUE WHERE order_id = %s", (order_id,))
        
#         # Actualizează cantitatea pentru fiecare produs în comandă
#         for detail in order_details:
#             cursor.execute("SELECT quantity FROM Product WHERE product_id = %s", (detail['product_id'],))
#             product = cursor.fetchone()
#             new_quantity = product['quantity'] - detail['quantity']
#             cursor.execute("UPDATE Product SET quantity = %s WHERE product_id = %s", (max(new_quantity, 0), detail['product_id']))

#         connection.commit()

#         return jsonify({'message': 'Aprobarea furnizorului și actualizarea cantității produsului au fost realizate cu succes!'}), 200

#     except Error as e:
#         return jsonify({'error': f"Eroare la confirmarea furnizorului și actualizarea cantității: {str(e)}"}), 500

#     finally:
#         if connection:
#             cursor.close()
#             connection.close()


if __name__ == '__main__':
    app.run(host='192.168.0.203', port=8005, debug=True)
