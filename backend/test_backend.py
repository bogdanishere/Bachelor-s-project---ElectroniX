import mysql.connector
from mysql.connector import Error

db_config = {
    'user': 'root',
    'password': 'manager',
    'host': 'localhost',
    'database': 'test_licenta2'
}

def connect_to_database(config):
    try:
        connection = mysql.connector.connect(**config)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None
    
def showProducts():
    data = ['username', 'password']
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM product")
    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    print(rows)

# showProducts()

def addClient(data):
   
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM User WHERE username = %s", (data['username'],))
        if cursor.fetchone():
            print('Client already exists!')
            return  # Exit the function if client exists
    except Error as e:
        print(f"Error checking existing user: {e}")
    else:
        try:
            cursor.execute("INSERT INTO User (username, password, email, type) VALUES (%s, %s, %s, %s)", 
                           (data['username'], data['password'], data['email'], 'client'))
            cursor.execute("INSERT INTO Client (username, first_name, last_name) VALUES (%s, %s, %s)", (data['username'], data['firstName'], data['lastName']))

            connection.commit()
            print('Client added successfully!')
        except Error as e:
            print(f"Error adding new client: {e}")
    finally:
        cursor.close()
        connection.close()

def loginClient(email, password):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM User WHERE email = %s AND password = %s", (email, password))
        client = cursor.fetchone()
        if client:
            print(f"{client['type'].capitalize()} logat!")
        else:
            print('Email sau parola gresita!')

    except mysql.connector.Error as e:
        print(f"Eroare la autentificare: {e}")
    finally:
        cursor.close()
        connection.close()

# Exemplu de utilizare
# loginClient('test@test', 'test')
# loginClient('employee@example.com', 'password456')
# loginClient('provider@example.com', 'password123')





        
client_data = {
    'username': 'newClient123',
    'password': 'securePassword!',
    'email': 'newclient123@example.com',
    'firstName': 'Jane',
    'lastName': 'Doe'
}

# addClient(client_data)

def add_command(data):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("INSERT INTO `Order` (client_username, employee_username, employee_approved) VALUES (%s, %s, %s)",(data['client_username'], data['employee_username'], False))
        order_id = cursor.lastrowid
        cursor.execute("INSERT INTO OrderDetails (order_id, product_id, provider_username, quantity, provider_approved) VALUES (%s, %s, %s, %s, %s)", 
                               (order_id, data['product_id'], 'providerXYZ', data['quantity'], False))
        connection.commit()
        print('Command added successfully!')

    except Error as e:
        print(f"Error adding new command: {e}")
    finally:
        cursor.close()
        connection.close()

# Example data
order_data = {
    'client_username': 'client123',
    'employee_username': 'employee456',
    'product_id': 'product789',
    'quantity': 2
}

# Call the function with example data
# add_command(order_data)

def confirm_employee(order_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("UPDATE `Order` SET employee_approved = %s WHERE order_id = %s", (True, order_id))
        connection.commit()
        print('Employee approval confirmed successfully!')
        return order_id
    except Error as e:
        print(f"Error confirming employee approval: {e}")
    finally:
        cursor.close()
        connection.close()


# confirm_employee(2)

def confirm_provider(order_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("UPDATE OrderDetails SET provider_approved = %s WHERE order_id = %s", (True, order_id))
        connection.commit()
        print('Provider approval confirmed successfully!')
        return order_id
    except Error as e:
        print(f"Error confirming provider approval: {e}")
    finally:
        cursor.close()
        connection.close()

# confirm_provider(2)
# confirm_provider(confirm_employee(2))
        
def modifyQuantityProduct(product_id, quantity_to_subtract):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    try:
        # Obțineți cantitatea actuală a produsului
        cursor.execute("SELECT quantity FROM Product WHERE product_id = %s", (product_id,))
        current_quantity = cursor.fetchone()['quantity']

        # Scădeți cantitatea curentă cu valoarea dată
        new_quantity = max(current_quantity - quantity_to_subtract, 0)

        # Actualizați cantitatea în baza de date
        cursor.execute("UPDATE Product SET quantity = %s WHERE product_id = %s", (new_quantity, product_id))
        connection.commit()
        print('Cantitate actualizata cu succes!')
    except mysql.connector.Error as e:
        print(f"Eroare la actualizarea cantității: {e}")
    finally:
        cursor.close()
        connection.close()

# modifyQuantityProduct('product012', 10)  


def show_orders():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM `Order`")
        orders = cursor.fetchall()
        print("Orders:")
        for order in orders:
            print(order)
    except mysql.connector.Error as e:
        print(f"Eroare la afișarea comenzilor: {e}")
    finally:
        cursor.close()
        connection.close()

def show_order_details():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM OrderDetails")
        order_details = cursor.fetchall()
        print("Order Details:")
        for order_detail in order_details:
            print(order_detail)
    except mysql.connector.Error as e:
        print(f"Eroare la afișarea detaliilor comenzilor: {e}")
    finally:
        cursor.close()
        connection.close()

# Exemplu de utilizare
show_orders()
show_order_details()



        

######
# Testare database
        
# showProducts()
# addClient(client_data)


# loginClient('newclient123@example.com', 'securePassword!')
# loginClient('employee@example.com', 'password456')
# loginClient('provider@example.com', 'password123')
        
# add_command(order_data)

# show_orders()
    
# confirm_employee(1)

# show_order_details()
        
# confirm_provider(1)
        
# modifyQuantityProduct('product012', 10)  




