import stripe
from flask import  jsonify
from mysql.connector import Error

def verify_payment(session_id):
    stripe.api_key = "sk_test_51Ow1Qg00IzukxrMJ1tHjjSbe43YsSjkfeGSN8KZJyxyr8nM6eAxH4mRBkloPBxOsJQ9VZzWEoa9O7XQjjxVkVfYs00vHyVh2nI"

    session = stripe.checkout.Session.retrieve(session_id)
    if session.payment_status == 'paid':
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'failure'})