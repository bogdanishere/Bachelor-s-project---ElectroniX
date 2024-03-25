from flask import jsonify, request
import mysql.connector
from mysql.connector import Error
import jwt
import datetime

SECRET_KEY = "asdgfdagHSDHUFDS09fdss"  

def addClient(db_config, data):
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
            
            token = jwt.encode({
                'username': data['username'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # Token-ul expiră după 24 ore
            }, SECRET_KEY, algorithm="HS256")

            response['message'] = 'Client added successfully!'
            response['user'] = data['username']
            response['token'] = token 
            return jsonify(response), 201
        except Error as e:
            response['error'] = f"Error adding new client: {e}"
            return jsonify(response), 500
    finally:
        cursor.close()
        connection.close()
