const toggleFormBtn = document.getElementById('toggleFormBtn');
        const addUserForm = document.getElementById('addUserForm');
        const updateUserForm = document.getElementById('updateUserForm');

        toggleFormBtn.addEventListener('click', () => {
            addUserForm.classList.toggle('hidden');
        });

        function showUpdateForm(id, name, buildType, level) {
            document.getElementById('updateHeroId').value = id;
            document.getElementById('updateHeroName').value = name;
            document.getElementById('updateHeroBuildType').value = buildType;
            document.getElementById('updateHeroLevel').value = level;
            updateUserForm.classList.remove('hidden');
        }

        

        // Pagination variables
        let currentPage = 1;
        const rowsPerPage = 5;

        // Function to display the table rows
        function displayTableRows() {
            const table = document.getElementById('heroTable').getElementsByTagName('tbody')[0];
            const rows = table.getElementsByTagName('tr');
            const totalRows = rows.length;

            // Hide all rows
            for (let i = 0; i < totalRows; i++) {
                rows[i].style.display = 'none';
            }

            // Calculate start and end indexes for current page
            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;

            // Show only the rows for the current page
            for (let i = startIndex; i < endIndex && i < totalRows; i++) {
                rows[i].style.display = '';
            }
        }

        // Function to go to the next page
        document.getElementById('nextBtn').addEventListener('click', () => {
            const table = document.getElementById('heroTable').getElementsByTagName('tbody')[0];
            const totalRows = table.getElementsByTagName('tr').length;

            if ((currentPage * rowsPerPage) < totalRows) {
                currentPage++;
                displayTableRows();
            }
        });

        // Function to go to the previous page
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayTableRows();
            }
        });

        // Initial call to display table rows
        displayTableRows();

        document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Make an AJAX request to trigger logout
            fetch('/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(response => {
                if (response.ok) {
                    // Redirect the user to the login page after successful logout
                    window.location.href = '/';
                } else {
                    console.error('Logout failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
});