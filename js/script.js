const itemsPerPage = 10;
let currentPage = 1;

const renderTable = (data, page) => {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  currentData.forEach(post => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${post.id}</td>
      <td>${post.title}</td>
      <td class="contenido">${post.body}</td>
      <td><button type="button" class="btn more" data-bs-toggle="modal" data-bs-target="#modal" data-post-id="${post.id}">Detalles</button></td>
    `;
    tableBody.appendChild(row);
  });
};

const renderPagination = (data) => {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  const totalPages = Math.ceil(data.length / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const listItem = document.createElement('li');
    listItem.className = 'page-item';
    listItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    if (i === currentPage) {
      listItem.classList.add('active');
    }
    pagination.appendChild(listItem);
  }

  pagination.addEventListener('click', (event) => {
    event.preventDefault();
    const targetPage = parseInt(event.target.innerText);
    if (targetPage !== currentPage) {
      currentPage = targetPage;
      renderTable(data, currentPage);
      renderPagination(data);
    }
  });
};

const sortData = (data) => {
  data.sort((a, b) => a.id - b.id);
};

const fetchComments = (postId) => {
  fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    .then(response => response.json())
    .then(data => {
      renderComments(data);
    })
    .catch(error => console.error(error));
};

const renderComments = (comments) => {
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = '';

  comments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.innerHTML = `
      <h6>${comment.email}</h6>
      <p>${comment.body}</p>
    `;
    modalContent.appendChild(commentElement);
  });
};

fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(data => {
    sortData(data);
    renderTable(data, currentPage);
    renderPagination(data);
  })
  .catch(error => console.error(error));

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('more')) {
    const postId = event.target.getAttribute('data-post-id');
    fetchComments(postId);
  }
});
