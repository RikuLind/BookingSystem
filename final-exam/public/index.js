// State management
let selectedCustomerId = null;

// DOM elements
const form = document.getElementById("customer-form");
const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const birthDateInput = document.getElementById("birth-date");
const submitBtn = document.getElementById("btn-create");
const updateBtn = document.getElementById("btn-update");
const deleteBtn = document.getElementById("btn-delete");
const clearBtn = document.getElementById("btn-clear");
const formMessage = document.getElementById("form-message");

// Load customers on page load
async function loadCustomers() {
  const container = document.getElementById("customer-list");

  try {
    const res = await fetch("/api/persons");

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    // Clear placeholder
    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = "<p>No customers found.</p>";
      return;
    }

    // Create a list
    data.forEach(person => {
      const div = document.createElement("div");
      div.className = "customer-card";

      div.innerHTML = `
        <strong>${person.first_name} ${person.last_name}</strong><br>
        Email: ${person.email}<br>
        Phone: ${person.phone || "-"}
      `;

      div.addEventListener("click", (event) => {
        selectCustomer(person, event);
      });

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='color:red;'>Error loading data</p>";
  }
}

// Select a customer and populate the form
function selectCustomer(person, event) {
  selectedCustomerId = person.id;
  firstNameInput.value = person.first_name;
  lastNameInput.value = person.last_name;
  emailInput.value = person.email;
  phoneInput.value = person.phone || "";
  birthDateInput.value = person.birth_date || "";

  // Update button states
  submitBtn.textContent = "Create New";
  updateBtn.disabled = false;
  deleteBtn.disabled = false;

  // Highlight the selected customer
  document.querySelectorAll(".customer-card").forEach(card => {
    card.classList.remove("selected");
  });
  event.currentTarget.classList.add("selected");

  // Clear message
  clearMessage();
}

// Clear the form
function clearForm() {
  selectedCustomerId = null;
  form.reset();
  submitBtn.textContent = "Add Customer";
  updateBtn.disabled = true;
  deleteBtn.disabled = true;
  clearMessage();

  document.querySelectorAll(".customer-card").forEach(card => {
    card.classList.remove("selected");
  });
}

// Show message
function showMessage(text, type = "success") {
  formMessage.textContent = text;
  formMessage.className = `form-message form-message-${type}`;
  setTimeout(() => {
    if (formMessage.textContent === text) {
      clearMessage();
    }
  }, 4000);
}

// Clear message
function clearMessage() {
  formMessage.textContent = "";
  formMessage.className = "form-message";
}

// Handle form submission (Create or update depends on context)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    first_name: firstNameInput.value.trim(),
    last_name: lastNameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim() || null,
    birth_date: birthDateInput.value || null,
  };

  try {
    const res = await fetch("/api/persons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to create customer");
    }

    showMessage(`Customer "${result.person.first_name} ${result.person.last_name}" added successfully!`);
    form.reset();
    selectedCustomerId = null;
    updateBtn.disabled = true;
    deleteBtn.disabled = true;
    submitBtn.textContent = "Add Customer";
    await loadCustomers();
  } catch (err) {
    showMessage(`Error: ${err.message}`, "error");
  }
});

// Handle update button
updateBtn.addEventListener("click", async () => {
  if (!selectedCustomerId) return;

  const formData = {
    first_name: firstNameInput.value.trim(),
    last_name: lastNameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim() || null,
    birth_date: birthDateInput.value || null,
  };

  try {
    const res = await fetch(`/api/persons/${selectedCustomerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to update customer");
    }

    showMessage(`Customer "${result.person.first_name} ${result.person.last_name}" updated successfully!`);
    form.reset();
    selectedCustomerId = null;
    updateBtn.disabled = true;
    deleteBtn.disabled = true;
    submitBtn.textContent = "Add Customer";
    await loadCustomers();
  } catch (err) {
    showMessage(`Error: ${err.message}`, "error");
  }
});

// Handle delete button
deleteBtn.addEventListener("click", async () => {
  if (!selectedCustomerId) return;

  const customerName = `${firstNameInput.value} ${lastNameInput.value}`;

  if (!confirm(`Are you sure you want to delete "${customerName}"?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/persons/${selectedCustomerId}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to delete customer");
    }

    showMessage(`Customer "${customerName}" deleted successfully!`);
    form.reset();
    selectedCustomerId = null;
    updateBtn.disabled = true;
    deleteBtn.disabled = true;
    submitBtn.textContent = "Add Customer";
    await loadCustomers();
  } catch (err) {
    showMessage(`Error: ${err.message}`, "error");
  }
});

// Handle clear button
clearBtn.addEventListener("click", clearForm);

// Run on page load
loadCustomers();