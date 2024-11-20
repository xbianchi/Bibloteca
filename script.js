let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let pageRendering = false;
let pageNumPending = null;
const pdfCanvas = document.getElementById('pdfCanvas');
const ctx = pdfCanvas.getContext('2d');

document.getElementById('uploadButton').addEventListener('click', () => {
  document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', handleFile);

function handleFile(event) {
  const file = event.target.files[0];
  if (file) {
    const fileURL = URL.createObjectURL(file);
    loadPDF(fileURL);
    addToLibrary(file.name);
  }
}

function addToLibrary(name) {
  const bookList = document.getElementById('bookList');
  const listItem = document.createElement('li');
  listItem.textContent = name;
  bookList.appendChild(listItem);
}

function loadPDF(url) {
  const loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(pdf => {
    pdfDoc = pdf;
    totalPages = pdf.numPages;
    document.getElementById('totalPages').textContent = totalPages;
    renderPage(currentPage);
  });
}

function renderPage(num) {
  pageRendering = true;
  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale: 1.5 });
    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    page.render(renderContext).promise.then(() => {
      pageRendering = false;
      if (pageNumPending !== null) {
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });

    document.getElementById('currentPage').textContent = num;
  });
}

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage <= 1) return;
  currentPage--;
  renderPage(currentPage);
});

document.getElementById('nextPage').addEventListener('click', () => {
  if (currentPage >= totalPages) return;
  currentPage++;
  renderPage(currentPage);
});
