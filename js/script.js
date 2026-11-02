
// ========================================
// URBAN THREADS CLOTHING STORE
// WEDE5020 - PART 3
// COMPLETE JAVASCRIPT
// ========================================


// Confirm that JavaScript is connected.
console.log("Urban Threads JavaScript loaded!");


// ========================================
// 1. PRODUCT PAGE ELEMENTS
// ========================================

const searchInput = document.getElementById("product-search");
const categoryFilter = document.getElementById("category-filter");
const priceSort = document.getElementById("price-sort");
const productGrid = document.getElementById("products-grid");
const productCards = document.querySelectorAll(".product-card");
const productCount = document.getElementById("product-count");
const noResults = document.getElementById("no-results");


// ========================================
// 2. SEARCH AND FILTER PRODUCTS
// ========================================

function updateProducts() {

    // Check if this is the Products page.
    if (!productGrid || !searchInput ||
        !categoryFilter || !productCount || !noResults) {
        return;
    }

    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    let visibleProducts = 0;

    productCards.forEach(function (card) {

        const productText = card.textContent.toLowerCase();
        const productCategory = card.dataset.category;

        const matchesSearch = productText.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            productCategory === selectedCategory;

        if (matchesSearch && matchesCategory) {

            card.classList.remove("is-hidden");
            visibleProducts++;

        } else {

            card.classList.add("is-hidden");
        }
    });

    productCount.textContent =
        visibleProducts + " product(s) found";

    if (visibleProducts === 0) {
        noResults.classList.remove("is-hidden");
    } else {
        noResults.classList.add("is-hidden");
    }
}


// ========================================
// 3. SORT PRODUCTS BY PRICE
// ========================================

function sortProducts() {

    if (!productGrid || !priceSort) {
        return;
    }

    const cardsArray = Array.from(productCards);
    const sortOption = priceSort.value;

    if (sortOption === "low-high") {

        cardsArray.sort(function (a, b) {
            return Number(a.dataset.price) -
                   Number(b.dataset.price);
        });

    } else if (sortOption === "high-low") {

        cardsArray.sort(function (a, b) {
            return Number(b.dataset.price) -
                   Number(a.dataset.price);
        });

    } else {

        // Restore original product order.
        cardsArray.sort(function (a, b) {
            return Array.from(productCards).indexOf(a) -
                   Array.from(productCards).indexOf(b);
        });
    }

    cardsArray.forEach(function (card) {
        productGrid.appendChild(card);
    });
}


// ========================================
// 4. PRODUCT EVENT LISTENERS
// ========================================

if (searchInput && categoryFilter &&
    priceSort && productGrid) {

    searchInput.addEventListener("input", updateProducts);

    categoryFilter.addEventListener("change", updateProducts);

    priceSort.addEventListener("change", sortProducts);

    updateProducts();
}


// ========================================
// 5. PRODUCT IMAGE LIGHTBOX
// ========================================

const lightbox = document.getElementById("product-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const closeLightbox = document.getElementById("close-lightbox");

if (lightbox && lightboxImage && closeLightbox) {

    const images = document.querySelectorAll(".product-image img");

    let previousFocus = null;

    images.forEach(function (image) {

        image.setAttribute("tabindex", "0");
        image.setAttribute("role", "button");

        image.setAttribute(
            "aria-label",
            "View larger image of " + image.alt
        );

        function openImage() {

            previousFocus = document.activeElement;

            lightboxImage.src = image.currentSrc || image.src;
            lightboxImage.alt = image.alt;

            lightbox.classList.remove("is-hidden");

            closeLightbox.focus();
        }

        image.addEventListener("click", openImage);

        image.addEventListener("keydown", function (event) {

            if (event.key === "Enter" || event.key === " ") {

                event.preventDefault();
                openImage();
            }
        });
    });

    // Close the lightbox.
    function hideLightbox() {

        lightbox.classList.add("is-hidden");

        lightboxImage.removeAttribute("src");

        if (previousFocus) {
            previousFocus.focus();
        }
    }

    closeLightbox.addEventListener("click", hideLightbox);

    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {
            hideLightbox();
        }
    });

    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            !lightbox.classList.contains("is-hidden")
        ) {
            hideLightbox();
        }

        if (
            event.key === "Tab" &&
            !lightbox.classList.contains("is-hidden")
        ) {
            event.preventDefault();
            closeLightbox.focus();
        }
    });
}


// ========================================
// 6. INTERACTIVE FAQ ACCORDION
// ========================================

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(function (item) {

    const question = item.querySelector("h3");
    const answer = item.querySelector("p");

    if (!question || !answer) {
        return;
    }

    item.classList.add("closed");

    question.setAttribute("tabindex", "0");
    question.setAttribute("role", "button");
    question.setAttribute("aria-expanded", "false");

    const answerId = "faq-answer-" +
        Array.from(faqItems).indexOf(item);

    answer.id = answerId;

    question.setAttribute("aria-controls", answerId);

    function toggleFaq() {

        const isClosed = item.classList.toggle("closed");

        question.setAttribute(
            "aria-expanded",
            String(!isClosed)
        );
    }

    question.addEventListener("click", toggleFaq);

    question.addEventListener("keydown", function (event) {

        if (event.key === "Enter" || event.key === " ") {

            event.preventDefault();
            toggleFaq();
        }
    });
});


// ========================================
// 7. ENQUIRY FORM HINT
// ========================================

const enquiryType = document.getElementById("enq-type");
const enquiryHint = document.getElementById("enq-type-hint");

function updateEnquiryHint() {

    if (!enquiryType || !enquiryHint) {
        return;
    }

    let hint = "";

    switch (enquiryType.value) {

        case "Product enquiry":

            hint = "Please mention the clothing item you want to know about.";
            break;

        case "Size enquiry":

            hint = "Please mention the product and the size you need.";
            break;

        case "Order enquiry":

            hint = "Please describe your order question. Do not include payment details.";
            break;

        case "Return or exchange":

            hint = "Please describe the item and your return or exchange question.";
            break;

        default:

            hint = "How can Urban Threads help you today?";
    }

    enquiryHint.textContent = hint;
}

if (enquiryType) {

    enquiryType.addEventListener("change", updateEnquiryHint);

    updateEnquiryHint();
}


// ========================================
// 8. ENQUIRY FORM VALIDATION
// ========================================

const enquiryForm = document.getElementById("enquiry-form");
const enquiryResponse = document.getElementById("enquiry-response");

function validateEnquiryEmail(email) {

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}


// Display enquiry errors.
function showEnquiryError(field, message) {

    field.classList.add("input-error");

    field.setAttribute("aria-invalid", "true");

    const error = document.createElement("span");

    error.className = "error-message";
    error.textContent = message;

    field.parentElement.appendChild(error);
}


// Remove previous enquiry errors.
function clearEnquiryErrors() {

    if (!enquiryForm) {
        return;
    }

    enquiryForm.querySelectorAll(".error-message")
        .forEach(function (error) {
            error.remove();
        });

    enquiryForm.querySelectorAll(".input-error")
        .forEach(function (field) {

            field.classList.remove("input-error");
            field.removeAttribute("aria-invalid");
        });
}


// ========================================
// 9. HANDLE ENQUIRY FORM SUBMISSION
// ========================================

if (enquiryForm && enquiryResponse) {

    enquiryForm.addEventListener("submit", function (event) {

        event.preventDefault();

        clearEnquiryErrors();

        enquiryResponse.classList.add("is-hidden");

        const nameField = document.getElementById("enq-name");
        const surnameField = document.getElementById("enq-surname");
        const emailField = document.getElementById("enq-email");
        const messageField = document.getElementById("enq-message");

        if (!nameField || !surnameField ||
            !emailField || !messageField || !enquiryType) {
            return;
        }

        const name = nameField.value.trim();
        const surname = surnameField.value.trim();
        const email = emailField.value.trim();
        const message = messageField.value.trim();
        const type = enquiryType.value;

        let isValid = true;
        let firstInvalidField = null;

        function addError(field, text) {

            showEnquiryError(field, text);

            isValid = false;

            if (firstInvalidField === null) {
                firstInvalidField = field;
            }
        }

        // Validate name.
        if (name === "") {
            addError(nameField, "Please enter your name.");
        }

        // Validate surname.
        if (surname === "") {
            addError(surnameField, "Please enter your surname.");
        }

        // Validate email.
        if (email === "") {

            addError(emailField, "Please enter your email address.");

        } else if (!validateEnquiryEmail(email)) {

            addError(emailField, "Please enter a valid email address.");
        }

        // Validate enquiry type.
        if (type === "") {
            addError(enquiryType, "Please select a reason for your enquiry.");
        }

        // Validate message.
        if (message === "") {
            addError(messageField, "Please enter your enquiry message.");
        }

        // Stop if validation fails.
        if (!isValid) {

            firstInvalidField.focus();
            return;
        }

        // Prepare an automatic response.
        let responseMessage = "";

        switch (type) {

            case "Product enquiry":

                responseMessage =
                    "You can browse our clothing collection on the Products page. " +
                    "Please contact Urban Threads to confirm current availability.";
                break;

            case "Size enquiry":

                responseMessage =
                    "Product sizes are displayed on our Products page. " +
                    "Please check the size shown for the clothing item you are interested in.";
                break;

            case "Order enquiry":

                responseMessage =
                    "For questions about placing an order, please contact Urban Threads directly. " +
                    "This demonstration website does not process orders.";
                break;

            case "Return or exchange":

                responseMessage =
                    "For return or exchange enquiries, please contact Urban Threads " +
                    "to confirm the applicable conditions.";
                break;

            default:

                responseMessage =
                    "Thank you for your interest in Urban Threads. " +
                    "Browse our Products page to explore our clothing collection.";
        }

        // Display the automatic response.
        enquiryResponse.replaceChildren();

        const greeting = document.createElement("p");

        greeting.textContent =
            "Thank you, " + name + " " + surname + "!";

        const responseParagraph = document.createElement("p");

        responseParagraph.textContent = responseMessage;

        enquiryResponse.appendChild(greeting);
        enquiryResponse.appendChild(responseParagraph);

        // Prepare the email subject.
        const subject = "Urban Threads - " + type;

        // Prepare the email body.
        const emailBody =
            "Name: " + name + " " + surname + "\n" +
            "Email: " + email + "\n" +
            "Enquiry Type: " + type + "\n\n" +
            "Message:\n" + message;

        // Create the email link.
        const mailtoLink =
            "mailto:info@urbanthreads.co.za" +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(emailBody);

        // Display the email instructions.
        const emailNotice = document.createElement("p");

        emailNotice.textContent =
            "Your email application should open with your prepared enquiry. " +
            "Please press Send to deliver your message.";

        enquiryResponse.appendChild(emailNotice);

        // Display the response.
        enquiryResponse.classList.remove("is-hidden");

        // Open the customer's email application.
        window.location.href = mailtoLink;

        // Clear the form after preparing the email.
        enquiryForm.reset();

        // Reset the enquiry hint.
        updateEnquiryHint();

        // Move focus to the response.
        enquiryResponse.setAttribute("tabindex", "-1");
        enquiryResponse.focus();
    });
}


// ========================================
// 10. CONTACT FORM VALIDATION AND EMAIL
// ========================================

const contactForm = document.getElementById("contact-form");
const contactResponse = document.getElementById("contact-response");

if (contactForm && contactResponse) {

    // Display contact form errors.
    function showContactError(field, message) {

        field.classList.add("contact-invalid");

        field.setAttribute("aria-invalid", "true");

        const error = document.createElement("span");

        error.className = "contact-error";
        error.textContent = message;

        field.parentElement.appendChild(error);
    }

    // Remove previous contact errors.
    function clearContactErrors() {

        contactForm.querySelectorAll(".contact-error")
            .forEach(function (error) {
                error.remove();
            });

        contactForm.querySelectorAll(".contact-invalid")
            .forEach(function (field) {

                field.classList.remove("contact-invalid");
                field.removeAttribute("aria-invalid");
            });
    }

    // Listen for form submission.
    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        clearContactErrors();

        const nameField = document.getElementById("c-name");
        const surnameField = document.getElementById("c-surname");
        const emailField = document.getElementById("c-email");
        const phoneField = document.getElementById("c-tel");
        const typeField = document.getElementById("c-type");
        const messageField = document.getElementById("c-message");

        if (!nameField || !surnameField || !emailField ||
            !phoneField || !typeField || !messageField) {
            return;
        }

        const name = nameField.value.trim();
        const surname = surnameField.value.trim();
        const email = emailField.value.trim();
        const phone = phoneField.value.trim();
        const type = typeField.value;
        const message = messageField.value.trim();

        let isValid = true;
        let firstInvalidField = null;

        function addError(field, text) {

            showContactError(field, text);

            isValid = false;

            if (firstInvalidField === null) {
                firstInvalidField = field;
            }
        }

        // Validate name.
        if (name === "") {
            addError(nameField, "Please enter your name.");
        }

        // Validate surname.
        if (surname === "") {
            addError(surnameField, "Please enter your surname.");
        }

        // Validate email.
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            addError(emailField, "Please enter a valid email address.");
        }

        // Validate optional contact number.
        const phonePattern = /^\+?[0-9\s()-]{9,20}$/;

        if (phone !== "" && !phonePattern.test(phone)) {
            addError(phoneField, "Please enter a valid contact number.");
        }

        // Validate message type.
        if (type === "") {
            addError(typeField, "Please select a message type.");
        }

        // Validate message length.
        if (message.length < 10) {

            addError(
                messageField,
                "Your message must contain at least 10 characters."
            );
        }

        // Stop if validation fails.
        if (!isValid) {

            contactResponse.classList.add("is-hidden");

            firstInvalidField.focus();
            return;
        }

        // Prepare the email subject.
        const subject = "Urban Threads - " + type;

        // Prepare the email body.
        const body =
            "Name: " + name + " " + surname + "\n" +
            "Email: " + email + "\n" +
            "Contact Number: " + (phone || "Not provided") + "\n" +
            "Message Type: " + type + "\n\n" +
            "Message:\n" + message;

        // Create the email link.
        const mailtoLink =
            "mailto:info@urbanthreads.co.za" +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(body);

        // Display the confirmation message.
        contactResponse.textContent =
            "Your email application should open with your prepared message. " +
            "Please press Send in your email application to deliver it.";

        contactResponse.classList.remove("is-hidden");

        // Open the customer's default email application.
        window.location.href = mailtoLink;

        // Clear the contact form.
        contactForm.reset();
    });
}


// ========================================
// 11. INTERACTIVE MAP USING LEAFLET
// ========================================

const mapElement = document.getElementById("map");

// Only create the map if the map element and Leaflet are available.
if (mapElement && typeof L !== "undefined") {

    // Johannesburg city-centre coordinates.
    const johannesburgLocation = [-26.2041, 28.0473];

    // Create the map.
    const map = L.map("map").setView(johannesburgLocation, 13);

    // Add OpenStreetMap tiles.
    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">' +
                'OpenStreetMap contributors</a>'
        }
    ).addTo(map);

    // Add a marker for Johannesburg.
    L.marker(johannesburgLocation)
        .addTo(map)
        .bindPopup("Johannesburg, Gauteng")
        .openPopup();
}

// ========================================
// END OF URBAN THREADS JAVASCRIPT
// ========================================

console.log("Urban Threads functionality loaded successfully!");
