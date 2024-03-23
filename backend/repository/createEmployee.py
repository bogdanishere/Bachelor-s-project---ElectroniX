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

username = 'test_employee'
email = 'test_employee@example.com'


sql_user = "INSERT INTO user (username, password, email, type) VALUES (%s, %s, %s, %s)"
cursor.execute(sql_user, (username, "password_employee", email, "employee"))
    
sql_employee= "INSERT INTO employee (username, employee_name) VALUES (%s, %s)"
cursor.execute(sql_employee, (username, username))

connection.commit()

cursor.close()
connection.close()
