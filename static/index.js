var booksInCart = new Map();
var localStorage = Window.localStorage;
$( document ).ready(function() {
    console.log( "ready!" );
    populateCategories();
    attachHandlerToAllCategory();
    attachHandlerToTrendingCategory();
    attachedHandlerBooksButtons();
    loadBooksFromLocalStorage();
});

function loadBooksFromLocalStorage() {
    var numberOfBooks = 0;
    if (localStorage.getItem("shoppingCart")) {
        var shoppingCartString = JSON.parse(localStorage.getItem("shoppingCart"));
        booksInCart = new Map(shoppingCartString);

        booksInCart.forEach(function (book){
            numberOfBooks = numberOfBooks + book["quantity"];
        });
    }
    updateNumberOfBooksInCartElement(numberOfBooks);
}

function updateNumberOfBooksInCartElement(numberOfBooks) {
    var numberElement = $("#number-of-books-in-cart");
    numberElement.empty();
    numberElement.text(numberOfBooks);
    if (numberOfBooks == 0) {
        $("#checkout-button").attr("disabled", "true");
    } else {
        $("#checkout-button").removeAttr("disabled");
    }
}

function incrementNumberOfBooksInCartElement() {
    var numberElement = $("#number-of-books-in-cart");
    var currentNumberOfBooks = parseInt(numberElement.text());
    numberElement.empty();
    numberElement.text(currentNumberOfBooks + 1);
    $("#checkout-button").removeAttr("disabled");
}

function decrementNumberOfBooksInCartElement() {
    var numberElement = $("#number-of-books-in-cart");
    var newNumberOfBooks = parseInt(numberElement.text()) - 1;
    numberElement.empty();
    numberElement.text(newNumberOfBooks);
    if (newNumberOfBooks == 0) {
        $("#checkout-button").attr("disabled", "true");
    }
}

function attachClickHandlerToCategory(target, url) {
    target.on("click", function(){
    console.log(target.text() + " was clicked" );
        $.ajax({
              url: url,
              method: "GET",
              dataType: 'json',
              context: document.body
            })
            .done(onGetBooksResponse)
            .fail(function() {
                console.log("error loading books" );
            });
    });
}

function attachHandlerToAllCategory() {
    var target = $( "#all-books-category" );
    var url = "/books/";
    attachClickHandlerToCategory(target, url);
}

function attachHandlerToTrendingCategory() {
    var target = $( "#trending-category" )
    var url = "trending/3";
    attachClickHandlerToCategory(target, url);
}
function populateCategories() {
// Load categories
    $.ajax({
      url: "/categories/",
      method: "GET",
      context: document.body
    })
    .done(function(data) {
        console.log( data );
        // the loading categories into navigation bar
        const categories = data.split(",");
        const categoriesRow = $( "#categories-row" );
        categoriesRow.on("click", ".category-button", onClickCategory);
        categories.forEach( function(category) {
            addCategory(category, categoriesRow);
        });
      })
    .fail(function() {
        console.log("error loading categories" );
    });
}

function addCategory(category, categoriesRow) {
    var formattedCategoryString = capitalizeFirstLetter(category.toLowerCase());
    const categoryHtmlElement = `<div class="col"><a class="category-button py-2 d-none d-md-inline-block btn btn-link" data-category="${category}">${formattedCategoryString}</a></div>`;

    categoriesRow.append(categoryHtmlElement);
}

function onClickCategory(event) {
    var target = $( event.target );
    console.log(target.data("category") + "is clicked");
    const url = "books?category="+ target.data("category");
    $.ajax({
      url: url,
      method: "GET",
      dataType: 'json',
      context: document.body
    })
    .done(onGetBooksResponse)
    .fail(function() {
        console.log("error loading books" );
    });
}

function onGetBooksResponse(booksData) {
    const parentBooksElement = $("#books-row");
    parentBooksElement.empty();
    booksData.books.forEach(function(bookObject) {
        addBookToPage(bookObject, parentBooksElement);
    });
}

function addBookToPage(bookObject, parentBooksElement) {
    var newBookElement = $("#hidden-book").clone();
    newBookElement.find(".book-name").text(bookObject.name);
    newBookElement.find(".book-author").text(bookObject.author);

    newBookElement.find(".book-price").text("$"+ Number(bookObject.price_usd).toFixed(2));

    newBookElement.find("button").data("book-id", bookObject.book_id);
    newBookElement.find("button").data("book-price", bookObject.price_usd);
    newBookElement.find("button").data("book-name", bookObject.name);
    newBookElement.find("button").data("book-author", bookObject.author);
    newBookElement.find("img").attr("src","book-images/" + bookObject.image_file_name);

    newBookElement.removeAttr('hidden');
    newBookElement.removeAttr('id');
    newBookElement.appendTo(parentBooksElement);
}

function attachedHandlerBooksButtons() {
    const parentBooksElement = $("#books-row");
    parentBooksElement.on("click", ".add-book-button", addToCartHandler);
    parentBooksElement.on("click", ".remove-book-button", removeFromCartHandler);
}

function addToCartHandler(event) {
    var target = $(event.target);
    var bookId = target.data("book-id");
    var bookPrice = target.data("book-price");
    var bookName = target.data("book-name");
    var bookDescription = target.data("book-author");

    if (!booksInCart.has(bookId)) {
        console.log("Adding book id " + bookId + " name: " + bookName + " to cart");
        const bookObject = new Object();
        bookObject["price"] = bookPrice;
        bookObject["name"] = bookName;
        bookObject["price"] = bookPrice;
        bookObject["author"] = bookDescription;
        bookObject["quantity"] = 1;
        booksInCart.set(bookId, bookObject);

        incrementNumberOfBooksInCartElement();
        updateLocalStorage();
    }
}

function removeFromCartHandler(event) {
    var target = $(event.target);
    var bookId = target.data("book-id");
    var bookName = target.data("book-name");

    if (booksInCart.has(bookId)) {
        console.log("Removing book id" + bookId + " name: " + bookName + " from cart");
        booksInCart.delete(bookId);

        decrementNumberOfBooksInCartElement();
        updateLocalStorage();
    }
}

function updateLocalStorage() {
    var booksAndCartString = JSON.stringify(Array.from(booksInCart.entries()));
    localStorage.setItem("shoppingCart", booksAndCartString);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}