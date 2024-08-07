document.addEventListener("DOMContentLoaded", function() {
    // Load books from localStorage
    const unreadBooks = JSON.parse(localStorage.getItem("unreadBooks")) || [];
    const readBooks = JSON.parse(localStorage.getItem("readBooks")) || [];
    const unreadList = document.getElementById("unread-list");
    const readList = document.getElementById("read-list");
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const yearInput = document.getElementById("year");
    const isCompleteInput = document.getElementById("isComplete");
    const addButton = document.getElementById("add-button");

    // Function to render books
    function renderBooks() {
        unreadList.innerHTML = "";
        readList.innerHTML = "";

        unreadBooks.forEach(function(book) {
            renderBook(book, unreadList);
        });

        readBooks.forEach(function(book) {
            renderBook(book, readList);
        });
    }

    // Function to render a single book
    function renderBook(book, parentElement) {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${book.title}</strong> (${book.year}) - ${book.author}
            <button class="move-button">${book.isComplete ? "Belum selesai" : "Selesai"}</button>
            <button class="delete-button">Hapus</button>
        `;

        const moveButton = li.querySelector(".move-button");
        moveButton.addEventListener("click", function() {
            moveBook(book);
        });

        const deleteButton = li.querySelector(".delete-button");
        deleteButton.addEventListener("click", function() {
            deleteBook(book);
        });

        parentElement.appendChild(li);
    }

    // Function to add a new book
    function addBook() {
        const title = titleInput.value;
        const author = authorInput.value;
        const year = parseInt(yearInput.value);
        const isComplete = isCompleteInput.checked;

        if (title === "" || author === "" || isNaN(year)) {
            alert("Mohon isi semua informasi buku.");
            return;
        }

        const newBook = {
            id: +new Date(),
            title,
            author,
            year,
            isComplete
        };

        if (isComplete) {
            readBooks.push(newBook);
        } else {
            unreadBooks.push(newBook);
        }

        localStorage.setItem("unreadBooks", JSON.stringify(unreadBooks));
        localStorage.setItem("readBooks", JSON.stringify(readBooks));

        renderBooks();

        titleInput.value = "";
        authorInput.value = "";
        yearInput.value = "";
        isCompleteInput.checked = false;
    }

    // Function to move a book between shelves
    function moveBook(book) {
        const sourceShelf = book.isComplete ? readBooks : unreadBooks;
        const targetShelf = book.isComplete ? unreadBooks : readBooks;

        const index = sourceShelf.findIndex((item) => item.id === book.id);

        if (index !== -1) {
            const movedBook = sourceShelf.splice(index, 1)[0];
            movedBook.isComplete = !movedBook.isComplete;
            targetShelf.push(movedBook);

            localStorage.setItem("unreadBooks", JSON.stringify(unreadBooks));
            localStorage.setItem("readBooks", JSON.stringify(readBooks));

            renderBooks();
        }
    }

    // Function to delete a book
    function deleteBook(book) {
        const shelf = book.isComplete ? readBooks : unreadBooks;
        const index = shelf.findIndex((item) => item.id === book.id);

        if (index !== -1) {
            shelf.splice(index, 1);

            localStorage.setItem("unreadBooks", JSON.stringify(unreadBooks));
            localStorage.setItem("readBooks", JSON.stringify(readBooks));

            renderBooks();
        }
    }

    addButton.addEventListener("click", addBook);

    // Initial rendering
    renderBooks();
});
