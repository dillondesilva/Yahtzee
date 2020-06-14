var csvButton = document.getElementById("uploadCsv");

function uploadCsv() {
    fileInput.trigger('click');
}

csvButton.addEventListener("click", () => uploadCsv())