document.addEventListener("DOMContentLoaded", () => {

    // ==== ORDER SYSTEM ====
    let order = [];
    const orderTableBody = document.querySelector("#order-body");
    const totalCell = document.querySelector("#total-price");
    const emptyText = document.getElementById("empty-text");

    const summaryBox = document.getElementById("order-summary");
    const summaryList = document.getElementById("order-summary-list");
    const summaryTotal = document.getElementById("order-summary-total");

    const addButtons = document.querySelectorAll(".meal button, .Drink button, .Sweet button");

    // إضافة منتج إلى الطلب عند الضغط على زر
    addButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.parentElement;
            const name = card.querySelector("h4").innerText;
            const price = parseFloat(card.querySelector("p").innerText.replace("Price: $", ""));

            let existing = order.find(item => item.name === name);

            if (existing) {
                existing.quantity++;
                existing.total = existing.quantity * price;
            } else {
                order.push({ name, price, quantity: 1, total: price });
            }

            updateOrderTable();
        });
    });

    // تحديث جدول الطلبات
    function updateOrderTable() {
        orderTableBody.innerHTML = "";
        let total = 0;

        if (order.length === 0) {
            emptyText.style.display = "block";
            totalCell.textContent = "$0.00";
            return;
        }

        emptyText.style.display = "none";

        order.forEach((item, index) => {
            total += item.total;
            orderTableBody.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.total.toFixed(2)}</td>
                    <td><button onclick="removeItem(${index})">Remove</button></td>
                </tr>`;
        });

        totalCell.textContent = `$${total.toFixed(2)}`;
    }

    // إزالة عنصر من الطلب
    window.removeItem = function (index) {
        order.splice(index, 1);
        updateOrderTable();
    }

    // تأكيد الطلب وعرض الملخص
    document.getElementById("confirm-order").addEventListener("click", () => {
        if (order.length === 0) return alert("You have no items to confirm!");

        summaryList.innerHTML = "";
        let total = 0;

        order.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.name} x${item.quantity} = $${item.total.toFixed(2)}`;
            summaryList.appendChild(li);
            total += item.total;
        });

        summaryTotal.textContent = `Total: $${total.toFixed(2)}`;
        summaryBox.style.display = "block";

        // إرسال الطلب إلى السيرفر
        fetch("saveorder.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orders: order })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.status === "success" && data.order_id) {
                    window.open(`invoice.php?order_id=${data.order_id}`, "_blank");
                } else {
                    alert("Failed to save order!");
                }
            })
            .catch(err => console.error(err));

        order = [];
        updateOrderTable();
    });

    // ==== VIEW MENU SMOOTH SCROLL ====
    document.querySelector(".main-btn").addEventListener("click", () => {
        document.getElementById("Menu").scrollIntoView({ behavior: "smooth" });
    });

    // ==== CONTACT FORM ====
    document.querySelector("#contactUs form").addEventListener("submit", e => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const message = document.getElementById("message").value;

        if (name && message) {
            alert(`Thank you, ${name}! Your message has been sent.`);
            document.querySelector("#contactUs form").reset();
        } else {
            alert("Please fill in all fields.");
        }
    });

    // ==== QR CODE GENERATION ====
const qrcodeContainer = document.getElementById("qrcode");

// الحصول على الرابط الحالي تلقائياً بما فيه الـ IP
let currentURL = window.location.href;

// إذا كنت داخل ملف واحد مثل index.html فقط
// نضمن إزالة اسم الملف لإعطاء رابط صحيح
currentURL = currentURL.split("#")[0]; // بدون هاش
currentURL = currentURL.split("?")[0]; // بدون بارامترات

new QRCode(qrcodeContainer, {
    text: currentURL,
    width: 150,
    height: 150,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
});

   

});

