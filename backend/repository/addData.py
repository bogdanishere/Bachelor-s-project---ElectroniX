
import mysql.connector
import json
import random

# Specificați informațiile de autentificare
config = {
    "user": "root",
    "password": "manager",
    "host": "localhost",
    "database": "electronix",
    'port': 3308,
}

# Conectare la baza de date MySQL
connection = mysql.connector.connect(**config)
cursor = connection.cursor()

# Crearea tabelului Product dacă nu există
create_table_sql = """
CREATE TABLE IF NOT EXISTS product (
  product_id VARCHAR(255) PRIMARY KEY,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  weight TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  prices_availability VARCHAR(255),
  prices_condition TEXT,
  prices_merchant VARCHAR(255),
  prices_sourceURLs TEXT,
  categories TEXT,
  dateAdded VARCHAR(255),
  dateUpdated VARCHAR(255),
  imageURLs TEXT,
  sourceURLs TEXT,
  rating DECIMAL(3, 1),
  nr_rating INT
)
"""
cursor.execute(create_table_sql)
connection.commit()

# Încărcarea datelor JSON din fișier
with open('./backend/repository/output.json', 'r', encoding='utf-8') as file:
    json_data = json.load(file)

# Iterați prin datele JSON și inserați fiecare element în tabelul Product
for item in json_data:
    product_id = item["id"]  # Presupunem că 'id' din JSON corespunde cu 'product_id'
    price = item.get("price", 0)
    currency = item.get("prices.currency", "")
    weight = item.get("weight", "")  # Acum weight este de tip TEXT
    name = item.get("name", "")
    brand = item.get("brand", "")
    quantity = random.randint(50, 80)  # Generăm valori aleatorii pentru quantity
    prices_availability = item.get("prices.availability", "")
    prices_condition = item.get("prices.condition", "")
    prices_merchant = item.get("prices.merchant", "")
    prices_sourceURLs = item.get("prices.sourceURLs", "")
    categories = item.get("categories", "")
    dateAdded = item["dateAdded"]
    dateUpdated = item["dateUpdated"]
    imageURLs = item.get("imageURLs", "")
    sourceURLs = item.get("sourceURLs", "")
    rating = round(random.uniform(3.0, 5.0), 1)  # Generăm valori aleatorii pentru rating
    nr_rating = random.randint(30, 80)  # Generăm valori aleatorii pentru nr_rating
    
    # Pregătirea interogării SQL pentru inserarea datelor
    sql = """
    INSERT IGNORE INTO product (
        product_id, price, currency, weight, name, brand, quantity, prices_availability, prices_condition,
        prices_merchant, prices_sourceURLs, categories, dateAdded, dateUpdated, imageURLs, sourceURLs, rating, nr_rating
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    # Executarea interogării SQL
    cursor.execute(sql, (
        product_id, price, currency, weight, name, brand, quantity, prices_availability, prices_condition,
        prices_merchant, prices_sourceURLs, categories, dateAdded, dateUpdated, imageURLs, sourceURLs, rating, nr_rating
    ))
    connection.commit()

# Închiderea conexiunii cu baza de date
cursor.close()
connection.close()
