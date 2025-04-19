import sqlite3
import json
from http import HTTPStatus
import os
def handler(request):
    # Get user input from the query parameters
    first_name = request.args.get('first_name')
    last_name = request.args.get('last_name')

    # Validate input
    if not first_name or not last_name:
        return {
            "statusCode": HTTPStatus.BAD_REQUEST,
            "body": json.dumps({"error": "Both first_name and last_name are required."})
        }

    # Combine first and last name to form the display name (case-insensitive)
    display_name = f"{first_name} {last_name}".lower()

    # Connect to SQLite database and search for the user
    try:
        db_path = os.path.join(os.path.dirname(__file__), 'amazon_employeees.db')
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Query the database using the display name
        query = "SELECT * FROM amazon WHERE LOWER(display_name) = ?;"
        cursor.execute(query, (display_name,))

        # Fetch the result
        result = cursor.fetchone()

        if result:
            columns = [description[0] for description in cursor.description]
            user_data = {columns[i]: result[i] for i in range(len(columns))}
            return {
                "statusCode": HTTPStatus.OK,
                "body": json.dumps({"user": user_data})
            }
        else:
            return {
                "statusCode": HTTPStatus.NOT_FOUND,
                "body": json.dumps({"message": "No matching user found."})
            }
    except Exception as e:
        return {
            "statusCode": HTTPStatus.INTERNAL_SERVER_ERROR,
            "body": json.dumps({"error": str(e)})
        }
    finally:
        conn.close()