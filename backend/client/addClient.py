# from flask import jsonify, request
# import mysql.connector
# from mysql.connector import Error
# import jwt
# import datetime

# SECRET_KEY = "asdgfdagHSDHUFDS09fdss"  

# def addClient(db_config, data):
#     connection = mysql.connector.connect(**db_config)
#     cursor = connection.cursor(dictionary=True)
#     response = {}
    
#     try:
#         cursor.execute("SELECT * FROM User WHERE username = %s", (data['username'],))
#         if cursor.fetchone():
#             response['message'] = 'Client already exists!'
#             return jsonify(response), 400
#     except Error as e:
#         response['error'] = f"Error checking existing user: {e}"
#         return jsonify(response), 500
#     else:
#         try:
#             cursor.execute("INSERT INTO User (username, password, email, type) VALUES (%s, %s, %s, %s)", 
#                            (data['username'], data['password'], data['email'], 'client'))
#             cursor.execute("INSERT INTO Client (username, first_name, last_name) VALUES (%s, %s, %s)", 
#                            (data['username'], data['firstName'], data['lastName']))
#             connection.commit()
            
#             token = jwt.encode({
#                 'username': data['username'],
#                 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # Token-ul expiră după 24 ore
#             }, SECRET_KEY, algorithm="HS256")

#             response['message'] = 'Client added successfully!'
#             response['user'] = data['username']
#             response['token'] = token 
#             return jsonify(response), 201
#         except Error as e:
#             response['error'] = f"Error adding new client: {e}"
#             return jsonify(response), 500
#     finally:
#         cursor.close()
#         connection.close()


# from flask import jsonify, request
# import mysql.connector
# from mysql.connector import Error
# import jwt
# import datetime
# import bcrypt  

# SECRET_KEY = "asdgfdagHSDHUFDS09fdss"

# def addClient(db_config, data):
#     connection = mysql.connector.connect(**db_config)
#     cursor = connection.cursor(dictionary=True)
#     response = {}
    
#     try:
#         cursor.execute("SELECT * FROM User WHERE username = %s", (data['username'],))
#         if cursor.fetchone():
#             response['message'] = 'Client already exists!'
#             return jsonify(response), 400
#         else:
#             hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

#             cursor.execute("INSERT INTO User (username, password, email, type) VALUES (%s, %s, %s, %s)", 
#                            (data['username'], hashed_password, data['email'], 'client'))
#             cursor.execute("INSERT INTO Client (username, first_name, last_name) VALUES (%s, %s, %s)", 
#                            (data['username'], data['firstName'], data['lastName']))
#             connection.commit()
            
#             token = jwt.encode({
#                 'username': data['username'],
#                 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
#             }, SECRET_KEY, algorithm="HS256")

#             response['message'] = 'Client added successfully!'
#             response['user'] = data['username']
#             response['token'] = token
#             return jsonify(response), 201
#     except Error as e:
#         response['error'] = f"Error checking existing user or adding new client: {e}"
#         return jsonify(response), 500
#     finally:
#         cursor.close()
#         connection.close()


from flask import jsonify, request
import mysql.connector
from mysql.connector import Error
import jwt
import datetime
import bcrypt

SECRET_KEY = "asdgfdagHSDHUFDS09fdss"

def addClient(db_config, data):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    response = {}
    
    try:
        cursor.execute("SELECT * FROM User WHERE username = %s", (data['username'],))
        user_exists = cursor.fetchone()
        
        if user_exists:
            response['message'] = 'Client already exists!'
            return jsonify(response), 400
        else:
            # Hash the password
            hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

            # Debugging: Print the hashed password to verify it
            print(f"Hashed password: {hashed_password}")

            # Confirm the type of hashed_password to ensure it's a byte string.
            print(f"Type of hashed password: {type(hashed_password)}")

            # Insert the new user into the database
            cursor.execute(
                "INSERT INTO User (username, password, email, type) VALUES (%s, %s, %s, %s)", 
                (data['username'], hashed_password, data['email'], 'client')
            )

            # Debugging: Print what we are sending to the database
            print(f"Executing insert with username: {data['username']}, hashed_password: {hashed_password}, email: {data['email']}")

            cursor.execute(
                "INSERT INTO Client (username, first_name, last_name) VALUES (%s, %s, %s)", 
                (data['username'], data['firstName'], data['lastName'])
            )
            connection.commit()
            
            # Create a JWT token
            token = jwt.encode({
                'username': data['username'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, SECRET_KEY, algorithm="HS256")

            # If you're using pyjwt version 2.0.0 or higher, you do not need to decode the token.
            # If you get an AttributeError: 'str' object has no attribute 'decode', simply remove the .decode('utf-8') part.
            # token = token.decode('utf-8')  # Uncomment this if you're using an older version of pyjwt

            response['message'] = 'Client added successfully!'
            response['user'] = data['username']
            response['token'] = token
            return jsonify(response), 201
    except Error as e:
        response['error'] = f"Error checking existing user or adding new client: {e}"
        return jsonify(response), 500
    finally:
        cursor.close()
        connection.close()

