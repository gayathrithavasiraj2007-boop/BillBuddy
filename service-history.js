// ========================================
// BILLBUDDY - SERVICE HISTORY
// ========================================

const serviceList =
    document.getElementById("serviceList");

const emptyServices =
    document.getElementById("emptyServices");

const serviceCount =
    document.getElementById("serviceCount");

const totalServices =
    document.getElementById("totalServices");

const totalSpent =
    document.getElementById("totalSpent");

const productsServiced =
    document.getElementById("productsServiced");

const serviceModal =
    document.getElementById("serviceModal");

const serviceForm =
    document.getElementById("serviceForm");


function getServices() {

    return JSON.parse(
        localStorage.getItem("billbuddyServices")
    ) || [];

}


// ========================================
// OPEN / CLOSE MODAL
// ========================================

function openServiceForm() {

    serviceModal.classList.add("show");

}


function closeServiceForm() {

    serviceModal.classList.remove("show");

}


// ========================================
// SAVE SERVICE
// ========================================

serviceForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const service = {

            id: Date.now(),

            product:
                document.getElementById(
                    "serviceProduct"
                ).value.trim(),

            type:
                document.getElementById(
                    "serviceType"
                ).value,

            date:
                document.getElementById(
                    "serviceDate"
                ).value,

            cost:
                Number(
                    document.getElementById(
                        "serviceCost"
                    ).value
                ) || 0,

            center:
                document.getElementById(
                    "serviceCenter"
                ).value.trim(),

            notes:
                document.getElementById(
                    "serviceNotes"
                ).value.trim()

        };


        if (!service.product || !service.date) {

            alert(
                "Please enter product and service date."
            );

            return;

        }


        const services =
            getServices();


        services.push(service);


        localStorage.setItem(
            "billbuddyServices",
            JSON.stringify(services)
        );


        serviceForm.reset();

        closeServiceForm();

        renderServices();

        alert(
            "Service record saved successfully! 🎉"
        );

    }
);


// ========================================
// RENDER
// ========================================

function renderServices() {

    const services =
        getServices();


    serviceList.innerHTML = "";


    if (services.length === 0) {

        emptyServices.style.display =
            "block";

    } else {

        emptyServices.style.display =
            "none";


        [...services]
            .reverse()
            .forEach(service => {

                const card =
                    document.createElement("div");

                card.className =
                    "service-card";


                card.innerHTML = `

                    <div class="service-icon">
                        ⚒
                    </div>

                    <div class="service-product">

                        <strong>
                            ${escapeHTML(
                                service.product
                            )}
                        </strong>

                        <span>
                            ${
                                service.center ||
                                "Service center not added"
                            }
                        </span>

                    </div>

                    <div class="service-date">

                        <span>
                            SERVICE DATE
                        </span>

                        <strong>
                            ${service.date}
                        </strong>

                    </div>

                    <div class="service-cost">

                        <span>
                            COST
                        </span>

                        <strong>
                            ₹${Number(
                                service.cost
                            ).toLocaleString("en-IN")}
                        </strong>

                    </div>

                    <div class="service-type">
                        ${escapeHTML(
                            service.type
                        )}
                    </div>

                `;


                serviceList.appendChild(card);

            });

    }


    // ========================================
    // SUMMARY
    // ========================================

    const spent =
        services.reduce(
            (sum, service) =>
                sum + Number(service.cost || 0),
            0
        );


    const uniqueProducts =
        new Set(
            services.map(
                service =>
                    service.product.toLowerCase()
            )
        );


    totalServices.textContent =
        services.length;

    totalSpent.textContent =
        `₹${spent.toLocaleString("en-IN")}`;

    productsServiced.textContent =
        uniqueProducts.size;

    serviceCount.textContent =
        `${services.length} ${
            services.length === 1
                ? "record"
                : "records"
        }`;

}


// ========================================
// SECURITY
// ========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;

}


// ========================================
// INITIAL LOAD
// ========================================

renderServices();


// Close modal when clicking outside

serviceModal.addEventListener(
    "click",
    function (event) {

        if (event.target === serviceModal) {
            closeServiceForm();
        }

    }
);