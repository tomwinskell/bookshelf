const loader = document.getElementById("loader");

document.querySelector('.search').addEventListener('click', (e) => {
  getInput(e.target);
  fetchBooks(query);
});

let startIndex = 0;
let query;
let isFetching = false;
let hasMoreData = true;

function getInput(target) {
  const el = document.getElementById('search-query');
  query = el.value;
}

async function fetchBooks() {
  if ( isFetching || !hasMoreData ) return;
  isFetching = true;
  loader.style.display = 'block';
  
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}`
  );
  const data = await res.json();

  if ( data.length === 0 ) {
    hasMoreData = false;
    loader.innerText = 'No more content to load.'
    return;
  }

  renderBooks(data.items);
  startIndex++;
  isFetching = false;
  loader.style.display = 'none';
}

function renderBooks(booksArray) {
  const booksEl = document.querySelector('.books');
  booksArray.forEach((item) => {
    item = item['volumeInfo'];
    book = {
      title: item['title'] || null,
      author: item['authors'] ? item['authors'][0] : null,
      pageCount: item['pageCount'] || null,
      isbn: item['industryIdentifiers'] ? item['industryIdentifiers'][0]['identifier'] : null,
      imageUrl: item['imageLinks'] ? item['imageLinks']['thumbnail'] : '',
    };
    booksEl.insertAdjacentHTML(
      'beforeend',
      `
    <div class="book col-md-6 my-3">
      <h4>${book.title}</h4>
      <div>Author: <strong>${book.author}</strong></div>
      <div>Pages: <strong>${book.pageCount}</strong></div>
      <div>ISBN: <strong>${book.isbn}</strong></div>
      <img src="${book.imageUrl}" alt="">
    </div>`
    );
  });
}

window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !isFetching
  ) {
    fetchBooks();
  }
})