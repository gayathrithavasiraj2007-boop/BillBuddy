// ========================================
// BILLBUDDY - REMINDERS
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // DATA
    // ========================================

    const purchases =
        JSON.parse(
            localStorage.getItem("billbuddyPurchases") || "[]"
        );

    const rentReminders =
        JSON.parse(
            localStorage.getItem("billbuddyRentReminders") || "[]"
        );


    // ========================================
    // ELEMENTS
    // ========================================

    const reminderList =
        document.getElementById("reminderList");

    const emptyReminders =
        document.getElementById("emptyReminders");

    const reminderCount =
        document.getElementById("reminderCount");

    const emiCount =
        document.getElementById("emiCount");

    const dueSoonCount =
        document.getElementById("dueSoonCount");

    const warrantyCount =
        document.getElementById("warrantyCount");

    const openRentModal =
        document.getElementById("openRentModal");

    const closeRentModal =
        document.getElementById("closeRentModal");

    const rentModal =
        document.getElementById("rentModal");

    const rentForm =
        document.getElementById("rentForm");


    // ========================================
    // TODAY
    // ========================================

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    // ========================================
    // HELPERS
    // ========================================

    function formatDate(dateString) {

        if (!dateString) {
            return "-";
        }

        const date =
            new Date(dateString);

        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }


    function getDaysLeft(dateString) {

        const date =
            new Date(dateString);

        date.setHours(0, 0, 0, 0);

        return Math.ceil(
            (date - today) /
            (1000 * 60 * 60 * 24)
        );
    }


    function escapeHTML(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function getStatus(days) {

        if (days < 0) {

            return {
                text: "Overdue",
                className: "overdue"
            };

        }

        if (days === 0) {

            return {
                text: "Due today",
                className: "today"
            };

        }

        return {
            text: "Upcoming",
            className: ""
        };
    }


    // ========================================
    // BUILD REMINDERS
    // ========================================

    let reminders = [];


    // ----------------------------------------
    // EMI
    // ----------------------------------------

    purchases.forEach(function (purchase) {

        if (
            purchase.paymentType === "EMI" &&
            purchase.nextEmiDate
        ) {

            reminders.push({

                type: "emi",

                title:
                    purchase.productName ||
                    "EMI Payment",

                description:
                    "EMI payment",

                date:
                    purchase.nextEmiDate,

                amount:
                    purchase.emiAmount
                        ? "₹" +
                          Number(
                              purchase.emiAmount
                          ).toLocaleString("en-IN")
                        : "",

                icon: "₹"

            });

        }

    });


    // ----------------------------------------
    // WARRANTY
    // ----------------------------------------

    purchases.forEach(function (purchase) {

        if (purchase.warrantyExpiry) {

            reminders.push({

                type: "warranty",

                title:
                    purchase.productName ||
                    "Product",

                description:
                    "Warranty expires",

                date:
                    purchase.warrantyExpiry,

                amount: "",

                icon: "◇"

            });

        }

    });


    // ----------------------------------------
    // HOUSE RENT
    // ----------------------------------------

    rentReminders.forEach(function (rent) {

        if (rent.dueDate) {

            reminders.push({

                type: "rent",

                title:
                    rent.title ||
                    "House Rent",

                description:
                    "House rent due",

                date:
                    rent.dueDate,

                amount:
                    rent.amount
                        ? "₹" +
                          Number(
                              rent.amount
                          ).toLocaleString("en-IN")
                        : "",

                icon: "⌂"

            });

        }

    });


    // ========================================
    // SORT
    // ========================================

    reminders.sort(function (a, b) {

        return new Date(a.date) -
               new Date(b.date);

    });


    // ========================================
    // COUNTS
    // ========================================

    const emiReminders =
        reminders.filter(function (item) {

            return item.type === "emi";

        });


    const warrantyReminders =
        reminders.filter(function (item) {

            return item.type === "warranty";

        });


    const dueSoon =
        reminders.filter(function (item) {

            const days =
                getDaysLeft(item.date);

            return days >= 0 && days <= 30;

        });


    if (emiCount) {

        emiCount.textContent =
            emiReminders.length;

    }


    if (dueSoonCount) {

        dueSoonCount.textContent =
            dueSoon.length;

    }


    if (warrantyCount) {

        warrantyCount.textContent =
            warrantyReminders.length;

    }


    if (reminderCount) {

        reminderCount.textContent =
            reminders.length +
            (
                reminders.length === 1
                    ? " reminder"
                    : " reminders"
            );

    }


    // ========================================
    // EMPTY STATE
    // ========================================

    if (reminders.length === 0) {

        if (emptyReminders) {
            emptyReminders.style.display =
                "block";
        }

    } else {

        if (emptyReminders) {
            emptyReminders.style.display =
                "none";
        }

    }


    // ========================================
    // RENDER
    // ========================================

    if (reminderList) {

        reminderList.innerHTML =
            reminders.map(function (item) {

                const days =
                    getDaysLeft(item.date);

                const status =
                    getStatus(days);


                let daysText;


                if (days < 0) {

                    daysText =
                        Math.abs(days) +
                        " days overdue";

                } else if (days === 0) {

                    daysText =
                        "Due today";

                } else {

                    daysText =
                        days +
                        " days left";

                }


                return `

                    <div class="reminder-row">

                        <div class="reminder-icon ${item.type}">
                            ${item.icon}
                        </div>


                        <div class="reminder-main">

                            <strong>
                                ${escapeHTML(item.title)}
                            </strong>

                            <span>
                                ${escapeHTML(item.description)}
                                ${
                                    item.amount
                                        ? " · " +
                                          escapeHTML(item.amount)
                                        : ""
                                }
                            </span>

                        </div>


                        <div class="reminder-date">

                            <strong>
                                ${formatDate(item.date)}
                            </strong>

                            <span>
                                Due date
                            </span>

                        </div>


                        <div class="reminder-days">

                            <strong>
                                ${daysText}
                            </strong>

                            <span>
                                Reminder
                            </span>

                        </div>


                        <div class="reminder-status">

                            <span class="${status.className}">
                                ${status.text}
                            </span>

                        </div>

                    </div>

                `;

            }).join("");

    }


    // ========================================
    // OPEN RENT MODAL
    // ========================================

    if (openRentModal && rentModal) {

        openRentModal.addEventListener(
            "click",
            function () {

                rentModal.classList.add("active");

            }
        );

    }


    // ========================================
    // CLOSE RENT MODAL
    // ========================================

    if (closeRentModal && rentModal) {

        closeRentModal.addEventListener(
            "click",
            function () {

                rentModal.classList.remove(
                    "active"
                );

            }
        );

    }


    // ========================================
    // CLOSE OUTSIDE
    // ========================================

    if (rentModal) {

        rentModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === rentModal
                ) {

                    rentModal.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    // ========================================
    // SAVE RENT
    // ========================================

    if (rentForm) {

        rentForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const title =
                    document.getElementById(
                        "rentTitle"
                    ).value.trim();


                const amount =
                    document.getElementById(
                        "rentAmount"
                    ).value;


                const dueDate =
                    document.getElementById(
                        "rentDueDate"
                    ).value;


                const reminder =
                    document.getElementById(
                        "rentReminder"
                    ).value;


                if (
                    !title ||
                    !amount ||
                    !dueDate
                ) {

                    alert(
                        "Please fill all rent details."
                    );

                    return;

                }


                const rent = {

                    id: Date.now(),

                    title: title,

                    amount:
                        Number(amount),

                    dueDate:
                        dueDate,

                    reminder:
                        reminder,

                    createdAt:
                        new Date().toISOString()

                };


                let rents =
                    JSON.parse(
                        localStorage.getItem(
                            "billbuddyRentReminders"
                        ) || "[]"
                    );


                rents.push(rent);


                localStorage.setItem(
                    "billbuddyRentReminders",
                    JSON.stringify(rents)
                );


                alert(
                    "House rent reminder saved! 🏠"
                );


                rentForm.reset();


                if (rentModal) {

                    rentModal.classList.remove(
                        "active"
                    );

                }


                // Refresh page to show new reminder
                window.location.reload();

            }
        );

    }

});