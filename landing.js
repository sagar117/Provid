    document.getElementById('waitlistForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        const formData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            companyName: document.getElementById('company-name').value,
            email: document.getElementById('email').value,
            designation: document.querySelector('select[name="designation"]').value,
            helpArea: document.querySelector('select[name="helpArea"]').value
        };

        // Send form data to backend
        fetch('/api/waitlist/waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('successMessage').style.display = 'block'; // Show success message
            } else {
                alert('Failed to join the waitlist. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
