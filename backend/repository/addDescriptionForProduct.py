import mysql.connector
from openai import OpenAI
from unidecode import unidecode

config = {
    "user": "root",
    "password": "manager",
    "host": "localhost",
    "database": "electronix2",
    'port': 3308,
}

organization = 'org-2Hm8duodgXfUvforx03YY0x4'
api_key = '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'

cnx = mysql.connector.connect(**config)
read_cursor = cnx.cursor(buffered=True)
write_cursor = cnx.cursor()

def produul(name):
    client = OpenAI(organization=organization, api_key=api_key)
    content_message = "Genereaza o descriere a produsului in limba romana, fara diacritice(can't encode character  \u0103, \u0102, \u00E2, \u00C2, \u00EE, \u00CE, \u0219, \u0218, \u021B, \u021A ) pentru " + name
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": content_message}],
    )
    return response.choices[0].message.content

select_query = "SELECT product_id, name FROM product"

read_cursor.execute(select_query)
i=0
for (product_id, name) in read_cursor.fetchall():
    descriere = unidecode(produul(name))
    print(i)
    i+=1

    update_query = "UPDATE product SET description = %s WHERE product_id = %s"
    write_cursor.execute(update_query, (descriere, product_id))

    cnx.commit()
    print(f"Produsul cu ID {product_id} - {name} - a fost actualizat cu succes cu descriere.")

read_cursor.close()
write_cursor.close()
cnx.close()
