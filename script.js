const next = document.getElementById('nextPage');
const prev = document.getElementById('prevPage');
const first = document.getElementById("first");
const last = document.getElementById('last');
const box = document.getElementsByClassName('box');

let membersData = [];
var page = 1

document.addEventListener("DOMContentLoaded", function () {
    // Your API URL


    const apiUrl = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

    // Initial data


    // Function to fetch data from the API
    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            membersData = await response.json();
            // console.log(membersData);
            renderTable(page); // Render the initial table
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    fetchData();
});
// Function to render the table based on the current page
function renderTable(page) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = ""; // Clear previous data

    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    const currentPageData = membersData.slice(startIndex, endIndex);

    currentPageData.forEach(member => {
        const row = document.createElement("tr");
        row.setAttribute('data-id', member.id);
        row.innerHTML = `
                <td><input type="checkbox" class="rowCheckbox" id="${member.id}"></td>
                <td class="memberid"">${member.id}</td>
                <td class="name" id="nameId">${member.name}</td>
                <td class="email" id="emailId">${member.email}</td>
                <td class="role" id="roleId">${member.role}</td>
                <td>
                    <button class="editButton" onclick="editRow('${member.id}')">Edit</button> 
                    <button class="deleteButton" onclick="deleteRow('${member.id}')">Delete</button>
                </td>
            `;

        tableBody.appendChild(row);
    });

    updatePagination(page);
    addEventListeners();
}
 
//Edit Row
function editRow(memberId) {
    const row = document.querySelector(`tr[data-id="${memberId}"]`);
    // console.log(row)
    // Check if the row element is found
    if (row) {
        // Get the parent row element
        const parentRow = row.parentNode.parentNode;
        // Get the cells within the row
        const cells = row.querySelectorAll('td');

        // console.log(cells)

        // iterate through the cells starting from index 2 (excluding ID and checkboxes)
        for (let i = 2; i < cells.length - 1; i++) {
            // Get the current cell's text content
            const currentContent = cells[i].textContent;
            // console.log(currentContent)
            // Create an input element
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.value = currentContent;

            // Replace the cell's content with the input element
            cells[i].textContent = '';
            cells[i].appendChild(inputElement);
        }

        // Change the "Edit" button to a "Save" button with an onclick event to save changes
        const editButton = row.querySelector('.editButton');
        editButton.textContent = 'Save';
        editButton.onclick = function () {
            saveRowChanges(memberId);
        };
    }

}
// Function to save changes made during editing
function saveRowChanges(memberId) {
    // Find the row with the specified memberId
    const row = document.querySelector(`tr[data-id="${memberId}"]`);
    console.log(row)
    // Get the cells within the row
    const cells = row.querySelectorAll('td');

    // Iterate through the cells starting from index 2 (excluding ID and checkboxes)
    let name = ""
    let email = ""
    let role = ""
    for (let i = 2; i < cells.length - 1; i++) {
        // Get the input element within the cell
        const inputElement = cells[i].querySelector('input');
        if (i == 2)
            name = inputElement.value
        if (i == 3)
            email = inputElement.value
        if (i == 4)
            role = inputElement.value
        // cells[i].textContent = inputElement.value;
    }
    // console.log(name+" "+email+" "+role)
    for (let i = 0; i < membersData.length; i++) {
        if (membersData[i].id == memberId) {
            membersData[i].name = name;
            membersData[i].email = email;
            membersData[i].role = role;
        }
        renderTable(page)
    }
    // Change the "Save" button back to "Edit" with the original onclick event
    const editButton = row.querySelector('.editButton');
    editButton.textContent = 'Edit';
    editButton.onclick = function () {
        editRow(memberId);
    };
}
//deleteRow
function deleteRow(memberId) {

    // Use filter to create a new array excluding the object with the specified ID
    membersData = membersData.filter(member => member.id !== memberId);

    // Now, membersData doesn't contain the object with ID "5"
    renderTable(page)
}
//onclick next page
next.addEventListener('click', function () {
    page = page + 1
    renderTable(page)
});
//onclick previous page
prev.addEventListener('click', function () {
    page = page - 1
    renderTable(page)
})
//onclick on first page
first.addEventListener('click', function () {
    page = 1;
    renderTable(page);
})
last.addEventListener('click', function () {
    const n = membersData.length
    page = Math.ceil(n / 10);
    renderTable(page)

})


// Function to update pagination based on the current page
function updatePagination(currentPage) {
    const totalRecords = membersData.length;
    const totalPages = Math.ceil(totalRecords / 10);

    document.getElementById("currentPage").innerText = `Page ${currentPage}`;

    const firstPageBtn = document.querySelector(".first-page");
    const previousPageBtn = document.querySelector(".previous-page");
    const nextPageBtn = document.querySelector(".next-page");
    const lastPageBtn = document.querySelector(".last-page");

    firstPageBtn.disabled = currentPage === 1;
    previousPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
    lastPageBtn.disabled = currentPage === totalPages;
}

// Function to add event listeners
function addEventListeners() {
    const selectAllCheckbox = document.getElementById("selectAll");
    const deleteSelectedBtn = document.getElementById("deleteSelected");
    const searchBtn = document.getElementById("searchButton");
    const searchInput = document.getElementById('searchInput');




    // Select/Deselect all checkboxes
    selectAllCheckbox.addEventListener("change", function () {
        const rowCheckboxes = document.querySelectorAll(".rowCheckbox");
        rowCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });

    // Delete selected rows
    deleteSelectedBtn.addEventListener("click", function () {
        const selectedRows = document.querySelectorAll(".rowCheckbox:checked");
        selectedRows.forEach(row => {
            console.log(row.id)
            deleteRow(row.id)
            // row.closest("tr").remove();
        });
    });

    // Search button click event
    searchBtn.addEventListener("click", function () {
        performSearch();
    });
    //when user click enter on keyboard
    searchInput.addEventListener('keypress', function (event) {
        // Check if the pressed key is 'Enter'
        if (event.key === 'Enter') {
            // Trigger the search functionality (you can call your search function here)
            performSearch();
        }
    });
    function performSearch() {
        const searchtext = document.getElementById("searchInput").value.toLowerCase();
        const newArray = membersData.filter(obj =>
            Object.values(obj).some(value =>
                typeof value === "string" && value.toLowerCase().includes(searchtext.toLowerCase())
            )
        );
        membersData = newArray;
        console.log(membersData)
        renderTable(1);
    }
}

