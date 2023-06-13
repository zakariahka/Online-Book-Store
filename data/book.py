class Book:
    def __init__(self, book_id: int, name: str, author: str, image_file_name: str, price_usd: float,
                 category: str):
        self.book_id = book_id
        self.name = name
        self.author = author
        self.image_file_name = image_file_name
        self.price_usd = price_usd
        self.category = category
