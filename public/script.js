const getBooks = async() => {
    try {
        return (await fetch("https://a16.onrender.com/api/books")).json();
    } catch (error) {
        console.log(error);
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

const populateEditForm = (book) => {};

const addEditBook = async(e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-book-form");
    const formData = new FormData(form);
    let response;
    //trying to add a new "book lol tuff"
    if (form._id.value == -1) {
        formData.delete("_id");
        formData.delete("img");
        formData.append("summaries", getSummaries());

        console.log(...formData);

        response = await fetch("/api/books", {
            method: "POST",
            body: formData
        });
    }

    //successfully got data from server
    if (response.status != 200) {
        console.log("Error posting data");
    }

    response = await response.json();
    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showBooks();
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