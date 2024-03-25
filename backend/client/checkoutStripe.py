import stripe
from flask import  jsonify
from mysql.connector import Error

def create_checkout_session(data):
    stripe.api_key = "sk_test_51Ow1Qg00IzukxrMJ1tHjjSbe43YsSjkfeGSN8KZJyxyr8nM6eAxH4mRBkloPBxOsJQ9VZzWEoa9O7XQjjxVkVfYs00vHyVh2nI"
    price = data.get('price')
    currency = data.get('currency') 

    try:
        session = stripe.checkout.Session.create(
            line_items=[
                {
                    'price_data': {
                        'currency': currency,
                        'product_data': {
                            'name': 'Plata Produse',
                        },
                        'unit_amount': int(price) * 100,  
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url='http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:5173/',
        )
        return jsonify({'url': session.url, 'session_id': session.id}), 200
    except Exception as e:
        return jsonify(error=str(e)), 500