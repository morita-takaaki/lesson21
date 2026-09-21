document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const amountStr = urlParams.get("amount") || "0";
    const amount = parseInt(amountStr, 10);

    const amountDisplay = document.getElementById("amount-display");
    if (amountDisplay) {
        amountDisplay.innerText = `支払金額：¥${amount.toLocaleString()}`;
    }

    const paymentForm = document.getElementById("payment-form");
    if (paymentForm) {
        paymentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            executePayment(amount);
        });
    }
});

function executePayment(amount) {
    const selectedMethod = document.querySelector('input[name="method"]:checked');
    if (!selectedMethod) {
        alert("支払方法を選択してください。");
        return;
    }

    const payload = {
        amount: amount,
        method: selectedMethod.value
    };

    fetch("/api/payments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("決済処理に失敗しました。");
        }
        return response.json();
    })
    .then(data => {
        const msgDiv = document.getElementById("message");
        msgDiv.innerText = "決済が完了しました";
        msgDiv.style.display = "block";

        setTimeout(() => {
            window.location.href = "orders.html";
        }, 1500);
    })
    .catch(error => {
        console.error(error);
        alert("決済中にエラーが発生しました。");
    });
}