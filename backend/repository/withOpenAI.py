from flask import Flask
from flask_cors import CORS

from openai import OpenAI

app = Flask(__name__)

organization = 'org-2Hm8duodgXfUvforx03YY0x4'
api_key = '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'

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