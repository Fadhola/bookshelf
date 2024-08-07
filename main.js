function createBookItem(id, title, author, year, isComplete) {
  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");

  const bookTitle = document.createElement("h3");
  bookTitle.textContent = title;

  const bookAuthor = document.createElement("p");
  bookAuthor.textContent = `Penulis: ${author}`;

  const bookYear = document.createElement("p");
  bookYear.textContent = `Tahun: ${year}`;

  const actionDiv = document.createElement("div");
  actionDiv.classList.add("action");

  const moveButton = document.createElement("button");
  moveButton.textContent = isComplete ? "Belum selesai di Baca" : "Selesai dibaca";
  moveButton.classList.add(isComplete ? "green" : "red");

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Hapus buku";
  deleteButton.classList.add("red");

  actionDiv.appendChild(moveButton);
  actionDiv.appendChild(deleteButton);

  bookItem.appendChild(bookTitle);
  bookItem.appendChild(bookAuthor);
  bookItem.appendChild(bookYear);
  bookItem.appendChild(actionDiv);

  moveButton.addEventListener("click", function () {
    if (isComplete) {
      moveBookToIncomplete(id);
    } else {
      moveBookToComplete(id);
    }
  });

  deleteButton.addEventListener("click", function () {
    deleteBook(id);
  });

  return bookItem;
}

function refreshBookshelves() {
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (const book of books) {
    const bookItem = createBookItem(book.id, book.title, book.author, book.year, book.isComplete);
    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  }
}

function moveBookToComplete(id) {
  const index = books.findIndex((book) => book.id == id);
  if (index !== -1) {
    books[index].isComplete = true;
    refreshBookshelves();
    updateLocalStorage();
  }
}

function moveBookToIncomplete(id) {
  const index = books.findIndex((book) => book.id == id);
  if (index !== -1) {
    books[index].isComplete = false;
    refreshBookshelves();
    updateLocalStorage();
  }
}

function deleteBook(id) {
  const index = books.findIndex((book) => book.id == id);
  if (index !== -1) {
    books.splice(index, 1);
    refreshBookshelves();
    updateLocalStorage();
  }
}

const inputBookForm = document.getElementById("inputBook");
inputBookForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const titleInput = document.getElementById("inputBookTitle");
  const authorInput = document.getElementById("inputBookAuthor");
  const yearInput = document.getElementById("inputBookYear");
  const isCompleteInput = document.getElementById("inputBookIsComplete");

  const id = +new Date();
  const title = titleInput.value;
  const author = authorInput.value;
  const year = yearInput.value;
  const isComplete = isCompleteInput.checked;

  books.push({ id, title, author, year, isComplete });
  refreshBookshelves();
  updateLocalStorage();

  titleInput.value = "";
  authorInput.value = "";
  yearInput.value = "";
  isCompleteInput.checked = false;
});

const isCompleteInput = document.getElementById("inputBookIsComplete");
isCompleteInput.addEventListener("change", updateSubmitButtonText);

function updateSubmitButtonText() {
  const submitButton = document.getElementById("bookSubmit");
  const buttonText = isCompleteInput.checked ? "Masukkan Buku ke rak Selesai dibaca" : "Masukkan Buku ke rak Belum selesai dibaca";
  submitButton.textContent = buttonText;
}

updateSubmitButtonText();

const searchBookForm = document.getElementById("searchBook");
searchBookForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const searchTitleInput = document.getElementById("searchBookTitle");
  const searchTitle = searchTitleInput.value.toLowerCase();

  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTitle));
  refreshBookshelvesWithSearchResults(filteredBooks);

  searchTitleInput.value = "";
});

function refreshBookshelvesWithSearchResults(filteredBooks) {
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (const book of filteredBooks) {
    const bookItem = createBookItem(book.id, book.title, book.author, book.year, book.isComplete);
    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  }
}

const LOCAL_STORAGE_KEY = "bookshelf";
let books = [];

function initializeLocalStorage() {
  const storedBooks = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedBooks) {
    books = JSON.parse(storedBooks);
    refreshBookshelves();
  }
}

function updateLocalStorage() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
}

initializeLocalStorage();
