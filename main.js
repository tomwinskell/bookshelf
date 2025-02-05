document.querySelector('.search').addEventListener('click', (e) => {
  (async() => {
    renderBooks(await fetchJson(getInput(e.target)));
  })();
});

function getInput(target) {
  const el = document.getElementById('search-query');
  return el.value;
}

async function fetchJson(value) {
  const valArr = value.split(' ');
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${valArr.reduce(
      (struct, current, currentIndex) => {
        currentIndex === 0 ? (struct += current) : (struct += `+${current}`);
        return struct;
      },
      ''
    )}`
  );
  const data = await res.json();
  return data.items;
}

function renderBooks(booksArray) {
  const booksEl = document.querySelector('.books');
  booksArray.forEach((item) => {
    item = item['volumeInfo'];
    book = {
      title: item['title'] || null,
      author: item['authors'][0] || null,
      pageCount: item['pageCount'] || null,
      isbn: item['industryIdentifiers'][0]['identifier'] || null,
      imageUrl: item['imageLinks']['thumbnail'] || null,
    }
    booksEl.insertAdjacentHTML(
      'beforeend',
      `
    <div class="book col-md-6">
      <h4>${book.title}</h4>
      <div>Author: <strong>${book.author}</strong></div>
      <div>Pages: <strong>${book.pageCount}</strong></div>
      <div>ISBN: <strong>${book.isbn}</strong></div>
      <img src="${book.imageUrl}" alt="">
    </div>`
    )
  });
}
