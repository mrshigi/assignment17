const getbooks = async () => {
  try {
    return (await fetch("https://a17-dxv5.onrender.com/api/books")).json();
  } catch (error) {
    console.log(error);
  }
};

const showbooks = async () => {
  let books = await getbooks();
  let booksDiv = document.getElementById("book-list");
  booksDiv.innerHTML = "";
  books.forEach((book) => {
    const section = document.createElement("section");
    section.classList.add("book");
    booksDiv.append(section);

    const a = document.createElement("a");
    a.href = "#";
    section.append(a);

    const h3 = document.createElement("h3");
    h3.innerHTML = book.name;
    a.append(h3);

    if (book.img) {
      const img = document.createElement("img");
      img.src = "https://a17-dxv5.onrender.com/" + book.img;
      section.append(img);
    }

    a.onclick = (e) => {
      e.preventDefault();
      displayDetails(book);
    };
  });
};

const populateEditForm = (book) => {
  const form = document.getElementById("add-edit-book-form");
  form._id.value = book._id;
  form.name.value = book.name;
  form.description.value = book.description;
  const summariesP = document.getElementById("summary-boxes");
  summariesP.innerHTML = "";
  console.log(book.summaries);

  for (let i in book.summaries) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = book.summaries[i];
    summariesP.append(input);
  }
};
/*const populateEditForm = (book) => {
  const form = document.getElementById("add-edit-book-form");
  form._id.value = book._id;
  form.name.value = book.name;
  form.description.value = book.description;
  populateSummaries(book);
};*/
const populateSummaries = (book) => {
  const section = document.getElementById("summary-boxes");
  book.summaries.forEach((summaries) => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = summaries;
    section.append(input);
  });
};

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
    deleteBook(book._id);
  };

  populateEditForm(book);
};
async function deleteBook(_id) {
  let response = await fetch(`https://a17-dxv5.onrender.com/api/books/${_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (response.status != 200) {
    console.log("Error deleting");
    return;
  }

  let result = await response.json();
  showbooks();
  document.getElementById("book-details").innerHTML = "";
  resetForm();
  showbooks();
}

// Helper function to display errors on the page
function displayError(errorMessage) {
  const errorElement = document.getElementById("error-message");
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.style.display = "block";
  } else {
    console.error("Error message element not found");
  }
}
const getSummaries = () => {
  const inputs = document.querySelectorAll("#summary-boxes input");
  let summaries = [];

  inputs.forEach((input) => {
    summaries.push(input.value);
  });

  return summaries;
};
const addBook = (e) => {
  e.preventDefault();
  const section = document.getElementById("summary-boxes");
  const input = document.createElement("input");
  input.type = "text";
  section.append(input);
};
const addEditbook = async (e) => {
  e.preventDefault();

  const form = document.getElementById("add-edit-book-form");
  const formData = new FormData(form);
  formData.append("summaries", getSummaries());
  let response;
  console.log(form._id.value > 0 && form._id.value.length);
  if (form._id.value == -1) {
    formData.delete("_id");
    console.log(...formData);
    response = await fetch("https://a17-dxv5.onrender.com/api/books", {
      method: "POST",
      body: formData,
    });
  } else {
    console.log("editting");
    response = await fetch(
      `https://a17-dxv5.onrender.com/api/books/${form._id.value}`,
      {
        method: "PUT",
        body: formData,
      }
    );
  }
  if (response.status != 200) {
    console.log("ERROR posting data");
    return;
  }
  let result = await response.json();

  if (form._id.value != -1) {
    const book = await getBook(form._id.value);
    displayDetails(book);
  }
  document.querySelector(".dialog").classList.add("transparent");
  resetForm();
  showbooks();
};
const getBook = async (_id) => {
  let response = await fetch(`https://a17-dxv5.onrender.com/api/books/${_id}`);
  if (response.status != 200) {
    console.log("Error reciving Book");
    return;
  }

  return await response.json();
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

const handleEditFormSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  formData.append("summaries", getSummaries().join(","));
  try {
    const response = await fetch(
      "https://a17-dxv5.onrender.com/api/books/" + formData.get("_id"),
      {
        method: "PUT",
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await showbooks(); // Refresh the book list
  } catch (error) {
    console.error("Error updating book:", error);
  }
};
async function saveEditedBook(formData) {
  const response = await fetch(
    "https://a17-dxv5.onrender.com/api/books/" + formData.get("_id"),
    {
      method: "PUT",
      body: formData,
    }
  );
  if (response.status === 200) {
    // Update view
    showbooks();
  } else {
    // Handle error
    console.error("Error updating book");
  }
}
const addDeleteButton = (book, bookElement) => {
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = async () => {
    if (confirm("Are you sure you want to delete this book?")) {
      // Send DELETE request
      const response = await fetch(
        `https://a17-dxv5.onrender.com/api/books/${book._id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        bookElement.remove(); // Remove the book element from the DOM
        bookElement.remove();
      }
    }
  };
  bookElement.appendChild(deleteBtn);
};
window.onload = () => {
  showbooks();
  document.getElementById("add-edit-book-form").onsubmit = addEditbook;
  document.getElementById("add-link").onclick = showHideAdd;

  document.querySelector(".close").onclick = () => {
    document.querySelector(".dialog").classList.add("transparent");
  };

  document.getElementById("add-summary").onclick = addBook;
};
