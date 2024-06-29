from flask import Flask
from flask_cors import CORS

from openai import OpenAI

app = Flask(__name__)

organization = 'organisation_KEY'
api_key = 'API_KEY'

@app.route('/describeproduct/<string:name_product>', methods=['GET'])
def get_describeProduct(name_product):

    client = OpenAI(
        organization=organization,
        api_key = api_key
    )

    content_message = "Genereaza o descriere a produsului, " + name_product

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": content_message},
        ]
    )
    return [{"message": response.choices[0].message.content}]

# este foarte lent 5-7 secunde pe pagina
