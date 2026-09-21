document.addEventListener("DOMContentLoaded", () => {
    displayCart();
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.onclick = () => checkoutCart();
    }
});

function displayCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsTbody = document.getElementById("cart-items");
    const cartTotalHeader = document.getElementById("cart-total");
    cartItemsTbody.innerHTML = "";

    if (cart.length === 0) {
        cartItemsTbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center;">カートに商品が入っていません。</td>
            </tr>
        `;
        cartTotalHeader.innerText = "合計: ¥0";
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${escapeHtml(item.name)}</td>
            <td style="text-align: right;">¥${item.price.toLocaleString()}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">¥${subtotal.toLocaleString()}</td>
        `;
        cartItemsTbody.appendChild(row);
    });

    cartTotalHeader.innerText = `合計: ¥${total.toLocaleString()}`;
}

async function checkoutCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("カートが空です。");
        return;
    }

    let totalAmount = 0;
    for (const item of cart) {
        totalAmount += item.price * item.quantity;
    }

    try {
        for (const item of cart) {
            const payload = {
                product_id: item.id,
                quantity: item.quantity
            };
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("一部の商品の注文処理に失敗しました。");
            }
        }

        localStorage.removeItem("cart");
        window.location.href = `payment.html?amount=${totalAmount}`;

    } catch (error) {
        console.error(error);
        alert("注文処理中にエラーが発生しました。");
    }
}

function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[m];
    });
}