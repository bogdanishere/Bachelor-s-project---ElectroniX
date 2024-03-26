import bcrypt

# Hash a password
password = "examplePassword"
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
print(hashed)

# Verify the password
if bcrypt.checkpw(password.encode('utf-8'), hashed):
    print("Match!")
else:
    print("Does not match.")
