from flask import  jsonify, request
import mysql.connector
from mysql.connector import Error


def addClient(db_config):
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