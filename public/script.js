const getBooks = async () => {
  try {
    const response = await fetch("https://a17-dxv5.onrender.com/api/books");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};
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
};
async function saveEditedBook(formData) {
  const response = await fetch("/api/books/" + formData.get("_id"), {
    method: "PUT",
    body: formData,
  });
  if (response.status === 200) {
    // Update view
    showBooks();
  } else {
    // Handle error
    console.error("Error updating book");
  }
}

async function deleteBook(bookId) {
  if (confirm("Are you sure you want to delete this book?")) {
    const response = await fetch("/api/books/" + bookId, {
      method: "DELETE",
    });
    if (response.status === 200) {
      // Update view
      showBooks();
    } else {
      // Handle error
      console.error("Error deleting book");
    }
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

//document.getElementById('add-edit-book-container').addEventListener('submit', handleEditFormSubmit);

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

const addEditBook = async (e) => {
  e.preventDefault();
  const form = document.getElementById("add-edit-book-form");
  const formData = new FormData(form);

  // Append summaries for both new and edited books
  formData.append("summaries", getSummaries().join(","));

  // Client-side validation (mirror Joi validation)
  if (formData.get("name").trim().length < 3) {
    alert("Name must be at least 3 characters long.");
    return;
  }

  if (formData.get("description").trim().length < 3) {
    alert("Description must be at least 3 characters long.");
    return;
  }

  // Add or Edit Book
  try {
    let url = form._id.value === "-1" ? "/api/books" : `/api/books/${form._id.value}`;
    let method = form._id.value === "-1" ? "POST" : "PUT";

    // If adding a new book, delete the _id field
    if (form._id.value === "-1") {
      formData.delete("_id");
    }

    let response = await fetch(url, {
      method: method,
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle the response and update UI
    await response.json();
    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showBooks();
  } catch (error) {
    console.error("Error submitting form:", error);
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

window.onload = () => {
  showBooks();
  document.getElementById("add-edit-book-form").onsubmit = addEditBook;
  document.getElementById("add-link").onclick = showHideAdd;

  document.querySelector(".close").onclick = () => {
    document.querySelector(".dialog").classList.add("transparent");
  };

  document.getElementById("add-summary").onclick = addBook;
};
