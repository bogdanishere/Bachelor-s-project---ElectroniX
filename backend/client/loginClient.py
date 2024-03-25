# from flask import jsonify, request
# import mysql.connector
# from mysql.connector import Error
# import jwt
# import datetime

# SECRET_KEY = "asdgfdagHSDHUFDS09fdss"  

# def loginClient(db_config, data):
#     email = data.get('email')
#     password = data.get('password')

#     connection = None
#     try:
#         connection = mysql.connector.connect(**db_config)
#         cursor = connection.cursor(dictionary=True)
#         cursor.execute("SELECT * FROM User WHERE email = %s AND password = %s", (email, password))
#         user = cursor.fetchone()

#         if user:
#             token = jwt.encode({
#                 'username': user['username'],
#                 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
#             }, SECRET_KEY, algorithm="HS256")
            
#             return jsonify({
#                 'message': user['type'], 
#                 'user': user['username'],
#                 'token': token  
#             }), 200
#         else:
#             return jsonify({'error': 'Email sau parola greșită!'}), 401

#     except Error as e:
#         return jsonify({'error': f"Eroare la autentificare: {str(e)}"}), 500

#     finally:
#         if connection is not None and connection.is_connected():
#             cursor.close()
#             connection.close()


from flask import jsonify, request
import mysql.connector
from mysql.connector import Error
import jwt
import datetime
import bcrypt

SECRET_KEY = "asdgfdagHSDHUFDS09fdss"

def loginClient(db_config, data):
    email = data.get('email')
    password = data.get('password').encode('utf-8')  

    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT username, password, type FROM User WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user:
            if bcrypt.checkpw(password, user['password'].encode('utf-8')):
                token = jwt.encode({
                    'username': user['username'],
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
                }, SECRET_KEY, algorithm="HS256")
                
                return jsonify({
                    'message': user['type'], 
                    'user': user['username'],
                    'token': token
                }), 200
            else:
                return jsonify({'error': 'Email sau parola greșită!'}), 401
        else:
            return jsonify({'error': 'Email sau parola greșită!'}), 401

    except Error as e:
        return jsonify({'error': f"Eroare la autentificare: {str(e)}"}), 500

    finally:
        if connection is not None and connection.is_connected():
            cursor.close()
            connection.close()
