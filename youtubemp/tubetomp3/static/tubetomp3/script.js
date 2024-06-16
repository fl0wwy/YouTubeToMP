const loader = document.querySelector('.loading')
const form = document.getElementById('myForm')
const title = document.getElementById('title')
const radioBtns = document.querySelectorAll('input[type="radio"]')

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    loader.style.display = 'flex'
    
    // Collect form data
    var formData = new FormData(form);
    let filename = ''
    
    // Send form data via fetch
    fetch('/converting/', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            loader.style.display = 'none'
            alert('Invalid Youtube link!')
            throw new Error('Network response was not ok');
        }
        
        loader.style.display = 'none'
        // Get the filename from the Content-Disposition header
        const contentDisposition = response.headers.get('content-disposition');
        
        if (contentDisposition && contentDisposition.includes('Attachment')) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }
        
        return response.blob(); // Read the response body as blob (binary data)
    })
    .then(blob => {
        // Create a URL for the blob data and initiate download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename; // Specify the filename
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
    })
    .catch(error => {
        console.error('Error downloading file:', error);
    });

});

radioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        title.textContent = `YouTubeTo${btn.value.toUpperCase()}`
    })
})

