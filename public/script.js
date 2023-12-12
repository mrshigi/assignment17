const getBooks = async() => {
    try {
        return (await fetch("https://a16.onrender.com/api/books")).json();
    } catch (error) {
        console.log(error);
    }
};
const addEditBook = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-book-form");
    const formData = new FormData(form);

    if (form._id.value) { // Edit book
        await fetch(`/api/books/${form._id.value}`, {
            method: "PUT",
            body: formData
        });
    } else { // Add new book
        await fetch("/api/books", {
            method: "POST",
            body: formData
        });
    }

    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showBooks();
};

// Function to show a confirmation prompt before deletion
const confirmDelete = async (bookId) => {
    if (confirm("Are you sure you want to delete this book?")) {
        await fetch(`/api/books/${bookId}`, {
            method: "DELETE"
        });
        showBooks();
    }
};


const showBooks = async() => {
    let books = await getBooks();
    let booksDiv = document.getElementById("book-list");
    booksDiv.innerHTML = "";
    books.forEach((book) => {
        const section = document.createElement("section");
        section.classList.add("book");
        booksDiv.append(section);

        let img = document.createElement("img");
        section.append(img);
        img.src="https://a16.onrender.com/" + book.img;

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = book.name;
        a.append(h3);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => confirmDelete(book._id);
        section.appendChild(deleteButton);

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(book);
        };
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
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = () => confirmDelete(book._id);
    bookDetails.append(deleteButton);

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
const populateEditForm = (book) => {
    document.getElementById("name").value = book.name;
    document.getElementById("description").value = book.description;
    // Populate other fields as necessary
    document.getElementById("book-id").value = book._id;
};

const getSummaries = () => {
    const inputs = document.querySelectorAll("#summary-boxes input");
    let summaries = [];

    inputs.forEach((input) => {
        summaries.push(input.value);
    });

    return summaries;
}

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
}

window.onload = () => {
    showBooks();
    document.getElementById("add-edit-book-form").onsubmit = addEditBook;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-summary").onclick = addBook;
};