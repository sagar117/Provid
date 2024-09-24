document.getElementById('guideForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('guideName').value;
    const description = document.getElementById('guideDescription').value;

    fetch('http://localhost:3000/api/guides', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token') // Include JWT token
        },
        body: JSON.stringify({ name, description })
    })
    .then(response => {
        if (!response.ok) throw new Error('Guide creation failed');
        return response.json();
    })
    .then(data => {
        console.log('Guide created successfully:', data);
        // Optionally refresh the page or update the guide list
    })
    .catch(error => console.error('Error:', error));
});


