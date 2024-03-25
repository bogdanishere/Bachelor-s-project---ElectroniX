import jwt
from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS


def verify_token(data, db_config):
    SECRET_KEY = "asdgfdagHSDHUFDS09fdss"
    token = data.get('token1')
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM User WHERE username = %s", (decoded['username'],))
        user = cursor.fetchone()


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