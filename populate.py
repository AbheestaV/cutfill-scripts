import mysql.connector
from mysql.connector import Error
import random
import datetime

# Function to create a connection to the database
def create_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',        # Replace with your host
            user='root',    # Replace with your MySQL username
            password='password',# Replace with your MySQL password
            database='cutfill' # Replace with your database name
        )
        if connection.is_connected():
            print("Connected to MySQL database")
        return connection
    except Error as e:
        print(f"Error: {e}")
        return None

# Function to populate the CutFillData table
def populate_cut_fill_data(connection, num_records):
    try:
        cursor = connection.cursor()
        query = """
        INSERT INTO CutFillData (cut_value, fill_value)
        VALUES (%s, %s)
        """
        for _ in range(num_records):
            cut_value = random.uniform(0.0, 100.0)
            fill_value = random.uniform(0.0, 100.0)
            cursor.execute(query, (cut_value, fill_value))
        connection.commit()
        print(f"Inserted {num_records} records into CutFillData")
    except Error as e:
        print(f"Error: {e}")
    finally:
        cursor.close()

# Function to populate the MeasurementData table
def populate_measurement_data(connection, num_records):
    try:
        cursor = connection.cursor()
        query = """
        INSERT INTO MeasurementData (measurement_name, measurement_value)
        VALUES (%s, %s)
        """
        measurement_names = ['Length', 'Width', 'Height', 'Depth', 'Area', 'Volume']
        for _ in range(num_records):
            measurement_name = random.choice(measurement_names)
            measurement_value = random.uniform(0.0, 1000.0)
            cursor.execute(query, (measurement_name, measurement_value))
        connection.commit()
        print(f"Inserted {num_records} records into MeasurementData")
    except Error as e:
        print(f"Error: {e}")
    finally:
        cursor.close()

# Main function to run the script
def main():
    connection = create_connection()
    if connection is not None:
        try:
            populate_cut_fill_data(connection, 10)  # Number of records to insert
            populate_measurement_data(connection, 10)  # Number of records to insert
        finally:
            connection.close()
            print("Connection closed")

if __name__ == '__main__':
    main()
