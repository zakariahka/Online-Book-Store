from typing import List
import sqlite3

from data.book import Book
__author__ = "Michael Pogrebinsky - www.topdeveloperacademy.com"


class Database:
    """
    Contains all the methods that interact with the online book store database
    DO NOT MODIFY THIS CLASS
    """
    DATABASE_FILE = "resources/database.db"

    def get_all_supported_categories(self) -> str:
        """Returns a comma separated list of book categories"""

        connection = sqlite3.connect(Database.DATABASE_FILE)
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()

        rows = cursor.execute("SELECT DISTINCT category FROM books").fetchall()
        connection.close()

        return ",".join([row['category'] for row in rows])

    def get_trending_books(self, max_number_of_books: int) -> List[Book]:
        """Returns at most max_number_of_books of books from the database"""

        connection = sqlite3.connect(Database.DATABASE_FILE)
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()

        rows = cursor.execute("SELECT * FROM books LIMIT (?)",
                              (max_number_of_books,)).fetchall()

        connection.close()

        return [Book(row['id'],
                     row['name'],
                     row['author'],
                     row['image_file_name'],
                     row['price_usd'],
                     row['category']) for row in rows]

    def get_all_books(self) -> List[Book]:
        """Returns all the books in the database"""

        connection = sqlite3.connect(Database.DATABASE_FILE)
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()

        rows = cursor.execute("SELECT * FROM books").fetchall()

        connection.close()
        return [Book(row['id'],
                     row['name'],
                     row['author'],
                     row['image_file_name'],
                     row['price_usd'],
                     row['category']) for row in rows]

    def get_books_by_category(self, category: str) -> List[Book]:
        """Returns all the books of a given category"""

        connection = sqlite3.connect(Database.DATABASE_FILE)
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()

        rows = cursor.execute("SELECT * FROM books WHERE category = (?)", (category,)).fetchall()

        connection.close()

        return [Book(row['id'],
                     row['name'],
                     row['author'],
                     row['image_file_name'],
                     row['price_usd'],
                     row['category']) for row in rows]

    def purchase_books(self, first_name: str, last_name: str, billing_address: str, email: str, credit_card: str,
                       book_ids: List[int]):
        """Records the purchase in the database. One row for each book id"""

        connection = sqlite3.connect(Database.DATABASE_FILE)
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()

        rows = [(first_name,
                 last_name,
                 email,
                 billing_address,
                 credit_card,
                 book_id)
                for book_id in book_ids]

        cursor.executemany(
            """INSERT INTO orders (first_name, last_name, email, billing_address, credit_card, book_id)
                VALUES(?, ?, ?, ?, ?, ?)
            """,
            rows)

        connection.commit()

        print(f" All orders from {first_name} {last_name} email = {email}")
        print()

        orders = cursor.execute("SELECT * from orders WHERE first_name = (?) AND last_name = (?) AND email = (?)",
                                (first_name, last_name, email)).fetchall()

        [print(f"first_name = {order['first_name']}, "
               f"last_name = {order['last_name']}, "
               f"email = {order['email']}, "
               f"billing_address = {order['billing_address']}, "
               f"credit_card = ****************, "
               f"book_id = {order['book_id']}")
         for order in orders]

        connection.close()

    def get_book_file_name(self, book_id: int):
        """Returns the book file name for the given book id"""
        connection = sqlite3.connect(Database.DATABASE_FILE)
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()

        row = cursor.execute("SELECT book_file_name FROM books WHERE id = (?)", (book_id,)).fetchone()

        connection.close()

        return row["book_file_name"]
