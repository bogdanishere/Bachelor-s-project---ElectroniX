import mysql.connector


config = {
    "user": "root",
    "password": "manager",
    "host": "localhost",
    "database": "electronix",
    'port': 3308,
}

connection = mysql.connector.connect(**config)
cursor = connection.cursor()

cursor.execute("SELECT DISTINCT prices_merchant FROM product WHERE prices_merchant IS NOT NULL")
rows = cursor.fetchall()

data = [{"company": row[0]} for row in rows]

for row in data:
    company = row["company"]
    email = f"{company}@example.com"  

    sql_user = "INSERT INTO user (username, password, email, type) VALUES (%s, %s, %s, %s)"
    cursor.execute(sql_user, (company, "password_provider", email, "provider"))
    
    sql_provider = "INSERT INTO provider (username, company) VALUES (%s, %s)"
    cursor.execute(sql_provider, (company, company))

connection.commit()

cursor.close()
connection.close()
