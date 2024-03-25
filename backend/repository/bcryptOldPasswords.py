import mysql.connector
import bcrypt

db_config = {
    'user': 'root',
    'password': 'manager',
    'host': 'localhost',
    'database': 'electronix2',
    'port': '3308',
}

def cripteaza_parole():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(buffered=True)
    
    try:
        cursor.execute("SELECT username, password FROM user")
        users = cursor.fetchall()
        
        for user_id, user_password in users:
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(user_password.encode('utf-8'), salt)
            
            cursor.execute("UPDATE user SET password = %s WHERE username = %s", (hashed_password, user_id))
        
        connection.commit()
        print("Parolele au fost criptate și actualizate cu succes.")
        
    except mysql.connector.Error as err:
        print("Eroare la baza de date:", err)
        connection.rollback()  
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    cripteaza_parole()
