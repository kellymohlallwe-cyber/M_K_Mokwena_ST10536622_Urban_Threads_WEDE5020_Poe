// Confirm that JavaScript is connected.
console.log("Urban Threads JavaScript loaded!");


// ========================================
// 1. FIND THE PRODUCT PAGE ELEMENTS
// ========================================

// Search input.
const searchInput = document.getElementById("product-search");

// Category dropdown.
const categoryFilter = document.getElementById("category-filter");

// Price sorting dropdown.
const priceSort = document.getElementById("price-sort");

// Product grid.
const productGrid = document.getElementById("products-grid");

// All product cards.
const productCards = document.querySelectorAll(".product-card");

// Product count message.
const productCount = document.getElementById("product-count");

// No-results message.
const noResults = document.getElementById("no-results");


// ========================================
// 2. SEARCH AND FILTER PRODUCTS
// ========================================

// Function to update the visible products.
function updateProducts() {

    // Stop if this is not the Products page.
    if (!productGrid) {
        return;
    }

    // Read what the customer typed.
    const searchText = searchInput.value.trim().toLowerCase();

    // Read the selected category.
    const selectedCategory = categoryFilter.value;

    // Count products that match.
    let visibleProducts = 0;

    // Check each product card.
    productCards.forEach(function (card) {

        // Read product name, size and price.
        const productText = card.textContent.toLowerCase();

        // Read the category from HTML.
        const productCategory = card.dataset.category;

        // Check if product matches search text.
        const matchesSearch = productText.includes(searchText);

        // Check if product matches selected category.
        const matchesCategory =
            selectedCategory === "all" ||
            productCategory === selectedCategory;

        // Show product only if both conditions match.
        if (matchesSearch && matchesCategory) {

            card.classList.remove("is-hidden");

            // Increase matching product count.
            visibleProducts++;

        } else {

            // Hide products that do not match.
            card.classList.add("is-hidden");
        }
    });

    // Display number of matching products.
    productCount.textContent =
        visibleProducts + " product(s) found";

    // Show or hide the no-results message.
    if (visibleProducts === 0) {
        noResults.classList.remove("is-hidden");
    } else {
        noResults.classList.add("is-hidden");
    }
}


// ========================================
// 3. SORT PRODUCTS BY PRICE
// ========================================

// Function to arrange products.
function sortProducts() {

    // Stop if the grid does not exist.
    if (!productGrid) {
        return;
    }

    // Convert the product list into an array.
    const cardsArray = Array.from(productCards);

    // Read the sorting option.
    const sortOption = priceSort.value;

    // Sort from cheapest to most expensive.
    if (sortOption === "low-high") {

        cardsArray.sort(function (a, b) {
            return Number(a.dataset.price) -
                   Number(b.dataset.price);
        });

    // Sort from most expensive to cheapest.
    } else if (sortOption === "high-low") {

        cardsArray.sort(function (a, b) {
            return Number(b.dataset.price) -
                   Number(a.dataset.price);
        });

    } else {

        // Restore the original product order.
        cardsArray.sort(function (a, b) {
            return Array.from(productCards).indexOf(a) -
                   Array.from(productCards).indexOf(b);
        });
    }

    // Add cards back in the new order.
    cardsArray.forEach(function (card) {
        productGrid.appendChild(card);
    });
}


// ========================================
// 4. REGISTER PRODUCT EVENT LISTENERS
// ========================================

// Only run this section on the Products page.
if (searchInput && categoryFilter && priceSort && productGrid) {

    // Filter while the customer types.
    searchInput.addEventListener("input", updateProducts);

    // Filter when category changes.
    categoryFilter.addEventListener("change", updateProducts);

    // Sort when price option changes.
    priceSort.addEventListener("change", sortProducts);

    // Display the initial product count.
    updateProducts();
}


// ========================================
// 5. PRODUCT IMAGE LIGHTBOX
// ========================================

// Find the lightbox.
const lightbox = document.getElementById("product-lightbox");

// Find the enlarged image.
const lightboxImage = document.getElementById("lightbox-image");

// Find the close button.
const closeLightbox = document.getElementById("close-lightbox");

// Only run if lightbox elements exist.
if (lightbox && lightboxImage && closeLightbox) {

    // Find all product images.
    const images = document.querySelectorAll(".product-image img");

    // Remember which element opened the lightbox.
    let previousFocus = null;

    // Loop through each product image.
    images.forEach(function (image) {

        // Allow keyboard users to select the image.
        image.setAttribute("tabindex", "0");
        image.setAttribute("role", "button");
        image.setAttribute(
            "aria-label",
            "View larger image of " + image.alt
        );

        // Function to display the enlarged image.
        function openImage() {

            // Save the currently focused element.
            previousFocus = document.activeElement;

            // Use the original image.
            lightboxImage.src = image.currentSrc || image.src;

            // Copy the alternative text.
            lightboxImage.alt = image.alt;

            // Display the lightbox.
            lightbox.classList.remove("is-hidden");

            // Move keyboard focus to the close button.
            closeLightbox.focus();
        }

        // Open image when clicked.
        image.addEventListener("click", openImage);

        // Open image with Enter or Space.
        image.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openImage();
            }
        });
    });

    // Function to close the lightbox.
    function hideLightbox() {

        // Hide the lightbox.
        lightbox.classList.add("is-hidden");

        // Remove the enlarged image.
        lightboxImage.removeAttribute("src");

        // Return focus to the original element.
        if (previousFocus) {
            previousFocus.focus();
        }
    }

    // Close when the X button is clicked.
    closeLightbox.addEventListener("click", hideLightbox);

    // Close when the dark background is clicked.
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            hideLightbox();
        }
    });

    // Close when Escape is pressed.
    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            !lightbox.classList.contains("is-hidden")
        ) {
            hideLightbox();
        }

        // Keep Tab focus inside the lightbox.
        if (
            event.key === "Tab" &&
            !lightbox.classList.contains("is-hidden")
        ) {
            event.preventDefault();
            closeLightbox.focus();
        }
    });
}


/* =========================================
   URBAN THREADS - PART 3
   ENQUIRY FORM AND FAQ FUNCTIONALITY
========================================= */


/* =========================================
   1. INTERACTIVE FAQ ACCORDION
========================================= */

// Find all FAQ questions on the website.
const faqItems = document.querySelectorAll(".faq-item");

// Loop through each FAQ item.
faqItems.forEach(function (item) {

    // Find the question heading.
    const question = item.querySelector("h3");

    // Find the answer paragraph.
    const answer = item.querySelector("p");

    // Skip incomplete FAQ items.
    if (!question || !answer) {
        return;
    }

    // Hide the answer when the page first loads.
    item.classList.add("closed");

    // Allow the question to receive keyboard focus.
    question.setAttribute("tabindex", "0");

    // Tell assistive technology this acts as a button.
    question.setAttribute("role", "button");

    // Indicate that the answer is currently hidden.
    question.setAttribute("aria-expanded", "false");

    // Give the answer an ID for accessibility.
    const answerId = "faq-answer-" +
        Array.from(faqItems).indexOf(item);

    answer.id = answerId;

    // Connect the question to its answer.
    question.setAttribute("aria-controls", answerId);

    // Function to open or close an answer.
    function toggleFaq() {

        // Toggle the closed class.
        const isClosed = item.classList.toggle("closed");

        // Update accessibility information.
        question.setAttribute(
            "aria-expanded",
            String(!isClosed)
        );
    }

    // Open or close when clicked.
    question.addEventListener("click", toggleFaq);

    // Also support Enter and Space keys.
    question.addEventListener("keydown", function (event) {

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleFaq();
        }
    });
});


/* =========================================
   2. REASON FOR CONTACT HINT
========================================= */

// Find the enquiry dropdown.
const enquiryType = document.getElementById("enq-type");

// Find the hint paragraph.
const enquiryHint = document.getElementById("enq-type-hint");

// Function to update the hint.
function updateEnquiryHint() {

    // Stop if these elements do not exist.
    if (!enquiryType || !enquiryHint) {
        return;
    }

    // Store the message that will be displayed.
    let hint = "";

    // Check the customer's selected reason.
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

    // Display the hint.
    enquiryHint.textContent = hint;
}

// Update the hint when the dropdown changes.
if (enquiryType) {

    enquiryType.addEventListener(
        "change",
        updateEnquiryHint
    );

    // Display a hint when the page first loads.
    updateEnquiryHint();
}


/* =========================================
   3. ENQUIRY FORM VALIDATION
========================================= */

// Find the enquiry form.
const enquiryForm = document.getElementById("enquiry-form");

// Find the response area.
const enquiryResponse = document.getElementById("enquiry-response");

// Check whether an email has a basic valid format.
function validateEnquiryEmail(email) {

    // The email must contain text, @ and a domain.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}

// Function to display an error below a field.
function showEnquiryError(field, message) {

    // Add a red border.
    field.classList.add("input-error");

    // Mark the field as invalid for accessibility.
    field.setAttribute("aria-invalid", "true");

    // Create an error message.
    const error = document.createElement("span");

    error.className = "error-message";
    error.textContent = message;

    // Display the message below the field.
    field.parentElement.appendChild(error);
}

// Function to remove previous errors.
function clearEnquiryErrors() {

    // Remove old error messages.
    enquiryForm.querySelectorAll(".error-message")
        .forEach(function (error) {
            error.remove();
        });

    // Remove invalid styling and accessibility state.
    enquiryForm.querySelectorAll(".input-error")
        .forEach(function (field) {
            field.classList.remove("input-error");
            field.removeAttribute("aria-invalid");
        });
}


/* =========================================
   4. HANDLE ENQUIRY SUBMISSION
========================================= */

// Only run on the Enquiries page.
if (enquiryForm && enquiryResponse) {

    // Listen for the Send Enquiry button.
    enquiryForm.addEventListener("submit", function (event) {

        // Prevent the browser from submitting the form.
        event.preventDefault();

        // Remove previous errors.
        clearEnquiryErrors();

        // Hide the previous response.
        enquiryResponse.classList.add("is-hidden");

        // Read the customer's details.
        const nameField = document.getElementById("enq-name");
        const surnameField = document.getElementById("enq-surname");
        const emailField = document.getElementById("enq-email");
        const messageField = document.getElementById("enq-message");

        const name = nameField.value.trim();
        const surname = surnameField.value.trim();
        const email = emailField.value.trim();
        const message = messageField.value.trim();

        // Assume the form is valid.
        let isValid = true;

        // Remember the first invalid field.
        let firstInvalidField = null;

        // Function to record a validation error.
        function addError(field, text) {

            showEnquiryError(field, text);
            isValid = false;

            if (firstInvalidField === null) {
                firstInvalidField = field;
            }
        }

        // Check the name.
        if (name === "") {
            addError(nameField, "Please enter your name.");
        }

        // Check the surname.
        if (surname === "") {
            addError(surnameField, "Please enter your surname.");
        }

        // Check the email.
        if (email === "") {
            addError(emailField, "Please enter your email address.");

        } else if (!validateEnquiryEmail(email)) {
            addError(emailField, "Please enter a valid email address.");
        }

        // Check the message.
        if (message === "") {
            addError(messageField, "Please enter your enquiry message.");
        }

        // Stop if validation fails.
        if (!isValid) {
            firstInvalidField.focus();
            return;
        }

        // Prepare a response based on enquiry type.
        let responseMessage = "";

        switch (enquiryType.value) {

            case "Product enquiry":
                responseMessage =
                    "You can browse our clothing collection on the Products page. " +
                    "Our displayed prices and sizes provide general product information. " +
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

        // Clear previous response content.
        enquiryResponse.replaceChildren();

        // Create a greeting safely using textContent.
        const greeting = document.createElement("p");

        greeting.textContent =
            "Thank you, " + name + " " + surname + "!";

        // Create the enquiry response paragraph.
        const responseParagraph = document.createElement("p");

        responseParagraph.textContent = responseMessage;

        // Add the paragraphs to the response area.
        enquiryResponse.appendChild(greeting);
        enquiryResponse.appendChild(responseParagraph);

        // Show the response.
        enquiryResponse.classList.remove("is-hidden");

        // Clear the form after successful validation.
        enquiryForm.reset();

        // Reset the dropdown hint.
        updateEnquiryHint();

        // Move focus to the response.
        enquiryResponse.setAttribute("tabindex", "-1");
        enquiryResponse.focus();
    });
}

/* ========================================
   URBAN THREADS - PART 3
   CONTACT FORM VALIDATION AND EMAIL
======================================== */

// Find the Contact Us form.
const contactForm = document.getElementById("contact-form");

// Find the response area.
const contactResponse = document.getElementById("contact-response");

// Only run this code on the Contact Us page.
if (contactForm && contactResponse) {

    // Function to display a field error.
    function showContactError(field, message) {

        // Highlight the invalid field.
        field.classList.add("contact-invalid");

        // Mark it as invalid for accessibility.
        field.setAttribute("aria-invalid", "true");

        // Create an error message.
        const error = document.createElement("span");

        error.className = "contact-error";
        error.textContent = message;

        // Display error below the field.
        field.parentElement.appendChild(error);
    }

    // Remove old errors before checking again.
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

        // Stop normal form submission.
        event.preventDefault();

        // Remove previous errors.
        clearContactErrors();

        // Read the customer's details.
        const nameField = document.getElementById("c-name");
        const surnameField = document.getElementById("c-surname");
        const emailField = document.getElementById("c-email");
        const phoneField = document.getElementById("c-tel");
        const typeField = document.getElementById("c-type");
        const messageField = document.getElementById("c-message");

        const name = nameField.value.trim();
        const surname = surnameField.value.trim();
        const email = emailField.value.trim();
        const phone = phoneField.value.trim();
        const type = typeField.value;
        const message = messageField.value.trim();

        // Keep track of validation errors.
        let isValid = true;
        let firstInvalidField = null;

        // Helper function for errors.
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

        // Validate email address.
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

        // Stop if any field is invalid.
        if (!isValid) {
            contactResponse.classList.add("is-hidden");
            firstInvalidField.focus();
            return;
        }

        // ========================================
        // PREPARE THE EMAIL
        // ========================================

        // Email subject.
        const subject = "Urban Threads - " + type;

        // Email body with customer information.
        const body =
            "Name: " + name + " " + surname + "\n" +
            "Email: " + email + "\n" +
            "Contact Number: " + (phone || "Not provided") + "\n" +
            "Message Type: " + type + "\n\n" +
            "Message:\n" + message;

        // Encode subject and body for an email link.
        const mailtoLink =
            "mailto:info@urbanthreads.co.za" +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(body);

        // Inform the customer.
        contactResponse.textContent =
            "Your details are valid. Your email application " +
            "should open with a prepared message. " +
            "Please press Send in your email application.";

        contactResponse.classList.remove("is-hidden");

        // Open the customer's default email application.
        window.location.href = mailtoLink;

        // Do not reset the form automatically.
        // The customer may need to retry if email does not open.
    });
}


