var localStorage = Window.localStorage;
var booksInCart = new Map();
$( document ).ready(function() {
    loadProductInCart();
    attachOnClickEventOnCompletePurchase();
});

function loadProductInCart() {
    if (localStorage.getItem("shoppingCart")) {
        var shoppingCartString = JSON.parse(localStorage.getItem("shoppingCart"));
        booksInCart = new Map(shoppingCartString);
        var listOfProductsInCartParent = $("#list-of-items-in-cart");
        var totalPrice = 0;
        var numberOfItems = 0;
        booksInCart.forEach(function (book){
            numberOfItems = numberOfItems + book["quantity"];
            totalPrice = totalPrice + book["price"]  * book["quantity"];
            var cartItem = $("#hidden-item").clone();
            cartItem.find("h6").text(book["name"]);
            cartItem.find("small").text(book["author"]);
            cartItem.find("span").text("$" + book["price"] + " x " + book["quantity"]);
            cartItem.addClass('<li id="hidden-item"  class="list-group-item d-flex justify-content-between lh-sm">');
            cartItem.removeAttr('id');
            listOfProductsInCartParent.prepend(cartItem);
        });
        $("#total-price").text("$" + parseFloat(totalPrice).toFixed( 2 ));
        $("#number-of-items").text(numberOfItems);
    }
}

function attachOnClickEventOnCompletePurchase() {
    $("form").on("submit", function(event) {
        var requestBody = buildPurchaseRequest();
        console.log("sending " +  requestBody);
        $.ajax({
          url: "/checkout/",
          method: "POST",
          contentType: "application/json",
          dataType: 'text',
          data: requestBody,
          context: document.body
        })
        .done(onConfirmPurchaseSuccess)
        .fail(onConfirmPurchaseError);
        event.preventDefault();
    });
}


function onConfirmPurchaseSuccess() {
    var completeCheckoutButton = $("#complete-checkout");
    completeCheckoutButton.attr("disabled", "true");
    completeCheckoutButton.removeClass("btn-primary");
    completeCheckoutButton.addClass("btn-success");
    completeCheckoutButton.text("success")

    booksInCart.forEach(function(book, bookId){
        var book_name = book["name"];
        const downloadElement = `<a download href="/book_download?book_id=${bookId}" class="list-group-item list-group-item-action">${book_name}</a>`;
        $("#books-list").append(downloadElement)
    });
    localStorage.clear();
    $('#downloadModal').modal('show');
}

function onConfirmPurchaseError(error) {
    alert("Error completing purchase: "  + error.responseText);
    console.log("Confirm purchased failed, with status code: " + error.status);
}

function buildPurchaseRequest() {
    var requestBody = new Object();
    requestBody["first_name"] = $("#firstName").val();
    requestBody["last_name"] = $("#lastName").val();
    requestBody["email"] = $("#email").val();
    requestBody["billing_address"] = $("#address").val();
    requestBody["credit_card"] = $("#credit-card-info").val();

    requestBody["book_ids"] = [];
    booksInCart.forEach(function(book, bookId){
        requestBody["book_ids"].push(bookId);
    });
    return JSON.stringify(requestBody);
}