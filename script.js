// ========================================
// BILLBUDDY - MAIN SCRIPT
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // ADD PURCHASE
    // ========================================

    const purchaseForm = document.querySelector(".purchase-form");

    if (purchaseForm) {

        purchaseForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const textInputs =
                purchaseForm.querySelectorAll('input[type="text"]');

            const numberInputs =
                purchaseForm.querySelectorAll('input[type="number"]');

            const dateInputs =
                purchaseForm.querySelectorAll('input[type="date"]');

            const selects =
                purchaseForm.querySelectorAll("select");

            const textarea =
                purchaseForm.querySelector("textarea");

            const fileInput =
                purchaseForm.querySelector('input[type="file"]');


            const productName =
                textInputs[0]?.value.trim() || "";

            const seller =
                textInputs[1]?.value.trim() || "";

            const price =
                numberInputs[0]?.value || "";

            const purchaseDate =
                dateInputs[0]?.value || "";

            const warrantyPeriod =
                selects[1]?.value || "";

            const warrantyExpiry =
                dateInputs[1]?.value || "";

            const selectedPayment =
                purchaseForm.querySelector(
                    'input[name="payment"]:checked'
                );

            let paymentType = "Full Payment";

            if (selectedPayment) {

                const paymentText =
                    selectedPayment.parentElement?.innerText || "";

                if (
                    paymentText
                        .toLowerCase()
                        .includes("emi")
                ) {
                    paymentType = "EMI";
                }
            }

            const emiAmount =
                numberInputs[1]?.value || "";

            const emiDuration =
                selects[2]?.value || "";

            const nextEmiDate =
                dateInputs[2]?.value || "";

            const reminder =
                selects[3]?.value || "";

            const notes =
                textarea?.value.trim() || "";


            // ========================================
            // VALIDATION
            // ========================================

            if (!productName) {
                alert("Please enter the product name.");
                return;
            }

            if (!price) {
                alert("Please enter the purchase price.");
                return;
            }

            if (!purchaseDate) {
                alert("Please select the purchase date.");
                return;
            }


            // ========================================
            // FILE / IMAGE
            // ========================================

            const file =
                fileInput?.files?.[0];


            // Save purchase function
            function savePurchase(billImage = "") {

                const purchase = {

                    id: Date.now(),

                    productName: productName,

                    seller: seller,

                    price: Number(price),

                    purchaseDate: purchaseDate,

                    warrantyPeriod: warrantyPeriod,

                    warrantyExpiry: warrantyExpiry,

                    paymentType: paymentType,

                    emiAmount:
                        emiAmount
                            ? Number(emiAmount)
                            : 0,

                    emiDuration: emiDuration,

                    nextEmiDate: nextEmiDate,

                    reminder: reminder,

                    notes: notes,

                    billImage: billImage,

                    billName:
                        file?.name || "",

                    createdAt:
                        new Date().toISOString()
                };


                let purchases = JSON.parse(
    localStorage.getItem(
        getPurchaseKey()
    ) || "[]"
);


                purchases.push(purchase);


                localStorage.setItem(
                    getPurchaseKey(),
                    JSON.stringify(purchases)
                );


                alert("Purchase saved successfully! 🎉");


                window.location.href =
                    "dashboard.html";
            }


            // ========================================
            // IF IMAGE / PDF SELECTED
            // ========================================

            if (file) {

                // Images
                if (file.type.startsWith("image/")) {

                    const reader =
                        new FileReader();

                    reader.onload = function () {

                        savePurchase(
                            reader.result
                        );
                    };

                    reader.readAsDataURL(file);

                }

                // PDF
                else if (
                    file.type === "application/pdf"
                ) {

                    const reader =
                        new FileReader();

                    reader.onload = function () {

                        savePurchase(
                            reader.result
                        );
                    };

                    reader.readAsDataURL(file);

                }

                else {

                    alert(
                        "Please upload an image or PDF file."
                    );

                }

            }

            // No file selected
            else {

                savePurchase("");

            }

        });

    }


    // ========================================
    // GET PURCHASES
    // ========================================

    function getCurrentUserForData() {
    return JSON.parse(
        sessionStorage.getItem("billbuddySession") || "null"
    );
}

function getPurchaseKey() {

    const user = JSON.parse(
        sessionStorage.getItem("billbuddySession") || "null"
    );

    if (!user) {
        return "billbuddyPurchases";
    }

    return `billbuddyPurchases_${user.userId}`;
}

function getPurchases() {

    return JSON.parse(
        localStorage.getItem(
            getPurchaseKey()
        ) || "[]"
    );
}


    // ========================================
    // DASHBOARD
    // ========================================

    const purchaseList =
        document.getElementById("purchaseList");

    if (purchaseList) {

        const purchases =
            getPurchases();

        const emptyState =
            document.getElementById("emptyState");


        if (purchases.length === 0) {

            if (emptyState) {
                emptyState.style.display = "flex";
            }

        }

        else {

            if (emptyState) {
                emptyState.style.display = "none";
            }


            // Remove old generated items
            purchaseList
                .querySelectorAll(".purchase-item")
                .forEach(item => item.remove());


            const latestPurchases =
                [...purchases]
                    .reverse()
                    .slice(0, 5);


            latestPurchases.forEach(
                purchase => {

                    const item =
                        document.createElement("div");

                    item.className =
                        "purchase-item";


                    const imageHTML =
                        purchase.billImage &&
                        purchase.billImage.startsWith(
                            "data:image"
                        )

                            ? `
                                <img
                                    src="${purchase.billImage}"
                                    class="product-image"
                                    alt="Bill"
                                >
                              `

                            : `
                                <div class="product-image laptop">
                                    ▱
                                </div>
                              `;


                    item.innerHTML = `

                        ${imageHTML}

                        <div class="purchase-info">

                            <strong>
                                ${escapeHTML(
                                    purchase.productName
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    purchase.seller ||
                                    "Store not added"
                                )}

                                ·

                                ${purchase.purchaseDate ||
                                "Date not added"}
                            </span>

                        </div>


                        <div class="purchase-price">

                            <strong>
                                ₹${Number(
                                    purchase.price
                                ).toLocaleString("en-IN")}
                            </strong>

                            <span>
                                ${purchase.paymentType ||
                                "Full Payment"}
                            </span>

                        </div>


                        <div class="purchase-actions">

    <div class="status active-status">
        Saved
    </div>

    <button
        type="button"
        class="remove-purchase"
        data-id="${purchase.id}"
    >
        Remove
    </button>

</div>

                    `;


                    purchaseList.appendChild(item);

                }
            );

        }


        // ========================================
        // DASHBOARD STATS
        // ========================================

        const totalBills =
            document.getElementById(
                "totalBills"
            );

        const activeWarranties =
            document.getElementById(
                "activeWarranties"
            );

        const expiringSoon =
            document.getElementById(
                "expiringSoon"
            );


        const today =
            new Date();


        if (totalBills) {

            totalBills.textContent =
                purchases.length;

        }


        const active =
            purchases.filter(
                purchase => {

                    if (!purchase.warrantyExpiry) {
                        return false;
                    }

                    const expiry =
                        new Date(
                            purchase.warrantyExpiry
                        );

                    return expiry >= today;
                }
            );


        if (activeWarranties) {

            activeWarranties.textContent =
                active.length;

        }


        const thirtyDays =
            new Date();

        thirtyDays.setDate(
            today.getDate() + 30
        );


        const expiring =
            purchases.filter(
                purchase => {

                    if (!purchase.warrantyExpiry) {
                        return false;
                    }

                    const expiry =
                        new Date(
                            purchase.warrantyExpiry
                        );

                    return (
                        expiry >= today &&
                        expiry <= thirtyDays
                    );

                }
            );


        if (expiringSoon) {

            expiringSoon.textContent =
                expiring.length;

        }

    }


    // ========================================
    // HELPER
    // ========================================

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

    // ========================================
// DASHBOARD - WARRANTY ALERTS
// ========================================

const dashboardWarrantyList =
    document.getElementById("dashboardWarrantyList");

const warrantyAlertCount =
    document.getElementById("warrantyAlertCount");

if (dashboardWarrantyList) {

    const purchases =
        getPurchases();

    const today =
        new Date();

    const warrantyItems =
        purchases
            .filter(purchase => purchase.warrantyExpiry)
            .map(purchase => {

                const expiry =
                    new Date(
                        purchase.warrantyExpiry
                    );

                const difference =
                    expiry - today;

                const daysLeft =
                    Math.ceil(
                        difference /
                        (1000 * 60 * 60 * 24)
                    );

                return {
                    ...purchase,
                    expiry,
                    daysLeft
                };

            })
            .filter(item => item.daysLeft >= 0)
            .sort(
                (a, b) =>
                    a.expiry - b.expiry
            )
            .slice(0, 3);


    dashboardWarrantyList.innerHTML = "";


    if (warrantyItems.length === 0) {

        dashboardWarrantyList.innerHTML = `

            <div class="warranty-empty">

                <strong>
                    No warranty alerts
                </strong>

                <span>
                    Your active warranties will appear here.
                </span>

            </div>

        `;

        if (warrantyAlertCount) {
            warrantyAlertCount.textContent = "0";
        }

    }

    else {

        if (warrantyAlertCount) {
            warrantyAlertCount.textContent =
                warrantyItems.length;
        }


        warrantyItems.forEach(item => {

            const warrantyItem =
                document.createElement("div");

            warrantyItem.className =
                "warranty-item";


            warrantyItem.innerHTML = `

                <div class="warranty-icon">
                    ♢
                </div>

                <div class="warranty-info">

                    <strong>
                        ${escapeHTML(
                            item.productName
                        )}
                    </strong>

                    <span>
                        Warranty expires
                    </span>

                </div>

                <div class="days-left">

                    <strong>
                        ${item.daysLeft}
                    </strong>

                    <small>
                        days
                    </small>

                </div>

            `;


            dashboardWarrantyList.appendChild(
                warrantyItem
            );

        });

    }

}

// ========================================
// REMOVE PURCHASE
// ========================================

document.addEventListener("click", function (event) {

    const removeButton =
        event.target.closest(".remove-purchase");

    if (!removeButton) return;

    const purchaseId =
        Number(removeButton.dataset.id);

    const user = JSON.parse(
        sessionStorage.getItem("billbuddySession") || "null"
    );

    if (!user) {
        alert("Please login again.");
        return;
    }

    const purchaseKey =
        `billbuddyPurchases_${user.userId}`;

    let purchases = JSON.parse(
        localStorage.getItem(purchaseKey) || "[]"
    );

    const purchase = purchases.find(
        item => Number(item.id) === purchaseId
    );

    if (!purchase) return;

    const confirmDelete = confirm(
        `Remove "${purchase.productName}"?`
    );

    if (!confirmDelete) return;

    purchases = purchases.filter(
        item => Number(item.id) !== purchaseId
    );

    localStorage.setItem(
        purchaseKey,
        JSON.stringify(purchases)
    );

    location.reload();
});

});