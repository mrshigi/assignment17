// Fetch and display books
async function getBooks() {
  try {
    const response = await fetch("/api/books");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const books = await response.json();
    showBooks(books);
  } catch (e) {
    console.error("Fetch error: " + e.message);
    displayError(e.message);
  }
}

const showBooks = async () => {
    try {
        const response = await fetch("/api/books"); // Correct API call
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const books = await response.json();
    
        const booksContainer = document.getElementById("books-container");
        if (booksContainer) {
          booksContainer.innerHTML = "";
        } else {
          console.error("Books container element not found");
        }
        books.forEach((book) => {
          // Create elements for each book
          const bookDiv = document.createElement("div");
          bookDiv.className = "book";
    
          const img = document.createElement("img");
          const name = document.createElement("div");
          const description = document.createElement("div");
    
          // Set content and attributes
          img.src = book.img
            ? book.img
            : "https://a17-dxv5.onrender.com/" + book.img; // Set image source
          name.textContent = book.name;
          description.textContent = book.description;
    
          // Append elements to the bookDiv
          bookDiv.appendChild(img);
          bookDiv.appendChild(name);
          bookDiv.appendChild(description);
    
          // Append bookDiv to the books container
          booksContainer.appendChild(bookDiv);
        });
      } catch (error) {
        console.error("Error fetching books:", error);
      }
}

// Add or edit book
async function addEditBook(e) {
  e.preventDefault();

  if (!validateBookForm()) return;

  const formData = new FormData(document.getElementById("bookForm"));
  const method = formData.get("_id") ? "PUT" : "POST";
  const endpoint = formData.get("_id")
    ? `/api/books/${formData.get("_id")}`
    : "/api/books";

  try {
    const response = await fetch(endpoint, {
      method: method,
      body: formData,
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const updatedBooks = await response.json();
    showBooks(updatedBooks);
  } catch (e) {
    console.error("Fetch error: " + e.message);
    displayError(e.message);
  }
}

// Client-side form validation
function validateBookForm() {
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").files[0];

  if (!name || name.length < 3) {
    displayError("Name is required and should be at least 3 characters.");
    return false;
  }

  if (!description || description.length < 3) {
    displayError(
      "Description is required and should be at least 3 characters."
    );
    return false;
  }

  if (!image) {
    displayError("Please upload an image.");
    return false;
  }

  return true;
}

// Delete book
async function deleteBook(bookId) {
  try {
    const response = await fetch(`/api/books/${bookId}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const updatedBooks = await response.json();
    showBooks(updatedBooks);
  } catch (e) {
    console.error("Fetch error: " + e.message);
    displayError(e.message);
  }
}

// Helper function to display errors on the page
function displayError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
}
const populateEditForm = (book) => {
  const form = document.getElementById("add-edit-book-form");
  form._id.value = book._id;
  document.getElementById("name").value = book.name;
  document.getElementById("description").value = book.description;
  document.getElementById("summaries").value = book.summaries.join(", ");
  document.getElementById("add-edit-title").textContent = "Edit Book";
  document.querySelector(".dialog").classList.remove("transparent");
};

const handleEditFormSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  formData.append("summaries", getSummaries().join(","));

  try {
    const response = await fetch("/api/books/" + formData.get("_id"), {
      method: "PUT",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await showBooks(); // Refresh the book list
  } catch (error) {
    console.error("Error updating book:", error);
  }
};

function displayError(errorMessage) {
  const errorElement = document.getElementById("error-message");
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.style.display = "block";
  } else {
    console.error("Error message element not found");
  }
}
const displayDetails = (book) => {
    const bookDetails = document.getElementById("book-details");
    bookDetails.innerHTML = "";
  
    const h3 = document.createElement("h3");
    h3.innerHTML = book.name;
    bookDetails.append(h3);
  
    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    bookDetails.append(dLink);
    dLink.id = "delete-link";
  
    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    bookDetails.append(eLink);
    eLink.id = "edit-link";
  
    const p = document.createElement("p");
    bookDetails.append(p);
    p.innerHTML = book.description;
  
    const ul = document.createElement("ul");
    bookDetails.append(ul);
    console.log(book.summary);
    book.summaries.forEach((summary) => {
      const li = document.createElement("li");
      ul.append(li);
      li.innerHTML = summary;
    });
  
    eLink.onclick = (e) => {
      e.preventDefault();
      document.querySelector(".dialog").classList.remove("transparent");
      document.getElementById("add-edit-title").innerHTML = "Edit Books";
    };
  
    dLink.onclick = (e) => {
      e.preventDefault();
    };
  
    populateEditForm(book);
  };
const addDeleteButton = (book, bookElement) => {
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = async () => {
    if (confirm("Are you sure you want to delete this book?")) {
      // Send DELETE request
      const response = await fetch(`/api/books/${book._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        bookElement.remove(); // Remove the book element from the DOM
      }
    }
  };
  bookElement.appendChild(deleteBtn);
};
const getSummaries = () => {
  const inputs = document.querySelectorAll("#summary-boxes input");
  let summaries = [];

  inputs.forEach((input) => {
    summaries.push(input.value);
  });

  return summaries;
};

const resetForm = () => {
  const form = document.getElementById("add-edit-book-form");
  form.reset();
  form._id = "-1";
  document.getElementById("summary-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
  e.preventDefault();
  document.querySelector(".dialog").classList.remove("transparent");
  document.getElementById("add-edit-title").innerHTML = "Add Book";
  resetForm();
};

const addBook = (e) => {
  e.preventDefault();
  const section = document.getElementById("summary-boxes");
  const input = document.createElement("input");
  input.type = "text";
  section.append(input);
};

// Setup event listeners on window load
window.onload = () => {
  showBooks();
  document.getElementById("add-edit-book-form").onsubmit = addEditBook;
  document.getElementById("add-link").onclick = showHideAdd;
  document.querySelector(".close").onclick = () => {
    document.querySelector(".dialog").classList.add("transparent");
  };

  document.getElementById("add-summary").onclick = addBook;
};

// Remaining functions (populateEditForm, saveEditedBook, displayDetails, etc.) unchanged
