document.addEventListener("DOMContentLoaded", function() {
    console.log("Script cargado y ejecutándose."); // Confirmación de carga

    // Carrito de compras
    let carrito = [];

    // Selecciona los botones de comprar
    const comprarButtons = document.querySelectorAll(".btn-dark");
    console.log("Botones de comprar encontrados:", comprarButtons.length);

    comprarButtons.forEach(button => {
        button.addEventListener("click", function() {
            // Encuentra el contenedor del producto más cercano
            const card = this.closest(".card");
            const title = card.querySelector(".card-title").textContent;
            const price = card.querySelector(".card-text strong").textContent;
            const product = {
                title: title.trim(),
                price: parseFloat(price.replace("$", "").replace(",", ""))
            };
            addToCart(product);
        });
    });

    function addToCart(product) {
        carrito.push(product);
        console.log("Producto añadido al carrito:", product); // Depuración
        updateCartUI();
        showNotification(`${product.title} ha sido añadido al carrito.`);
    }

    function updateCartUI() {
        const cartItems = document.getElementById("cartItems");
        const cartTotal = document.getElementById("cartTotal");
        const cartCount = document.getElementById("cartCount"); // Añadido para contar productos
        cartItems.innerHTML = ""; // Limpia la lista de items del carrito
        let total = 0;

        if (carrito.length === 0) {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.textContent = "Tu carrito está vacío.";
            cartItems.appendChild(li);
            cartCount.textContent = "0"; // Actualiza el contador
        } else {
            carrito.forEach((product, index) => {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.textContent = product.title;
                const span = document.createElement("span");
                span.textContent = `$${product.price.toFixed(2)}`;
                li.appendChild(span);

                // Botón para eliminar producto
                const removeButton = document.createElement("button");
                removeButton.textContent = "Eliminar";
                removeButton.className = "btn btn-danger btn-sm ms-2";
                removeButton.addEventListener("click", () => {
                    carrito.splice(index, 1); // Elimina el producto del carrito
                    updateCartUI(); // Actualiza la interfaz del carrito
                });
                li.appendChild(removeButton);

                cartItems.appendChild(li);
                total += product.price;
            });
            cartCount.textContent = carrito.length; // Actualiza el contador
        }

        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    function showNotification(message) {
        const toastEl = document.getElementById('notificationToast');
        const toast = new bootstrap.Toast(toastEl, {
            autohide: true,
            delay: 3000
        });
        const toastBody = toastEl.querySelector('.toast-body');
        toastBody.textContent = message;
        toast.show();
    }
});
