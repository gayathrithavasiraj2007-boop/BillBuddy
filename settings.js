// ========================================
// BILLBUDDY - SETTINGS
// ========================================

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

const warrantyNotifications =
    document.getElementById("warrantyNotifications");

const emiNotifications =
    document.getElementById("emiNotifications");

const serviceNotifications =
    document.getElementById("serviceNotifications");

const currency =
    document.getElementById("currency");

const reminderTime =
    document.getElementById("reminderTime");

const saveSettings =
    document.getElementById("saveSettings");

const saveMessage =
    document.getElementById("saveMessage");


// ========================================
// LOAD SETTINGS
// ========================================

function loadSettings() {

    const settings =
        JSON.parse(
            localStorage.getItem("billbuddySettings")
        ) || {};

    userName.value =
        settings.userName || "User";

    userEmail.value =
        settings.userEmail || "user@example.com";

    warrantyNotifications.checked =
        settings.warrantyNotifications !== false;

    emiNotifications.checked =
        settings.emiNotifications !== false;

    serviceNotifications.checked =
        settings.serviceNotifications || false;

    currency.value =
        settings.currency || "INR";

    reminderTime.value =
        settings.reminderTime || "7";
}


// ========================================
// SAVE SETTINGS
// ========================================

saveSettings.addEventListener("click", function () {

    const settings = {

        userName: userName.value.trim(),

        userEmail: userEmail.value.trim(),

        warrantyNotifications:
            warrantyNotifications.checked,

        emiNotifications:
            emiNotifications.checked,

        serviceNotifications:
            serviceNotifications.checked,

        currency:
            currency.value,

        reminderTime:
            reminderTime.value

    };

    localStorage.setItem(
        "billbuddySettings",
        JSON.stringify(settings)
    );

    saveMessage.textContent =
        "Settings saved successfully ✓";

    setTimeout(() => {

        saveMessage.textContent =
            "Changes are saved automatically.";

    }, 2500);

});


// ========================================
// CLEAR ALL DATA
// ========================================

document
    .getElementById("clearData")
    .addEventListener("click", function () {

        const confirmDelete =
            confirm(
                "Are you sure you want to delete all BillBuddy data?"
            );

        if (!confirmDelete) {
            return;
        }

        localStorage.removeItem("billbuddyPurchases");
        localStorage.removeItem("billbuddyServices");

        alert("All BillBuddy data has been cleared.");

        window.location.href =
            "dashboard.html";

    });


// ========================================
// INITIALIZE
// ========================================

loadSettings();