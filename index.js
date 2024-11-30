// Variables
var sname = document.getElementById("bookmarkName");
var ssite = document.getElementById("bookmarkURL");
var sbtn = document.getElementById("submitBtn");
var stable = document.getElementById("tableContent");
var deleteButtons, visitButtons;
var closeBtn = document.getElementById("closeBtn");
var sbox = document.querySelector(".box-info");
var data = [];

// Load data from localStorage
if (localStorage.getItem("dataList")) {
  data = JSON.parse(localStorage.getItem("dataList"));
  data.forEach(display);
}

// Display function to show bookmarks in the table
function display(index) {
  var ssiteValue = data[index].ssite;
  var validURL, fixedURL;
  var httpsRegex = /^https?:\/\//g;
  if (httpsRegex.test(ssiteValue)) {
    validURL = ssiteValue;
    fixedURL = validURL.split("").splice(validURL.match(httpsRegex)[0].length).join("");
  } else {
    fixedURL = ssiteValue;
    validURL = `https://${ssiteValue}`;
  }
  var newData = `
    <tr>
      <td>${index + 1}</td>
      <td>${data[index].sname}</td>              
      <td>
        <button class="btn visit" data-index="${index}">
          <i class="fa-solid fa-eye pe-2"></i>Visit
        </button>
      </td>
      <td>
        <button class="btn delete pe-2" data-index="${index}">
          <i class="fa-solid fa-trash-can"></i>Delete
        </button>
      </td>
    </tr>
  `;
  stable.innerHTML += newData;

  // Add event listeners for delete and visit buttons
  deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach(button => button.addEventListener("click", deleteData));

  visitButtons = document.querySelectorAll(".visit");
  visitButtons.forEach(button => button.addEventListener("click", visit));
}

// Function to clear input fields
function clearInput() {
  sname.value = "";
  ssite.value = "";
}

// Event listener for submit button
sbtn.addEventListener("click", function () {
  if (sname.classList.contains("is-valid") && ssite.classList.contains("is-valid")) {
    var dataItem = {
      sname: sname.value.charAt(0).toUpperCase() + sname.value.slice(1),
      ssite: ssite.value,
    };
    data.push(dataItem);
    localStorage.setItem("dataList", JSON.stringify(data));
    display(data.length - 1);
    clearInput();
    sname.classList.remove("is-valid");
    ssite.classList.remove("is-valid");
  } else {
    sbox.classList.remove("d-none");
  }
});

// Function to delete bookmark
function deleteData(e) {
  stable.innerHTML = "";
  var deletedIndex = e.target.dataset.index;
  data.splice(deletedIndex, 1);
  data.forEach(display);
  localStorage.setItem("dataList", JSON.stringify(data));
}

// Function to visit bookmarked site
function visit(e) {
  var dataIndex = e.target.dataset.index;
  var url = /^https?:\/\//.test(data[dataIndex].ssite) ? data[dataIndex].ssite : `https://${data[dataIndex].ssite}`;
  open(url);
}

// Regular expressions for name and URL validation
var nameRegex = /^\w{3,}$/;
var urlRegex = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;

// Event listeners for input validation
sname.addEventListener("input", function () {
  validate(sname, nameRegex);
});

ssite.addEventListener("input", function () {
  validate(ssite, urlRegex);
});

// Function to validate input fields
function validate(element, regex) {
  var test = regex.test(element.value);
  if (test) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
  } else {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
  }
}

// Function to close modal
function closeModal() {
  sbox.classList.add("d-none");
}
closeBtn.addEventListener("click", closeModal);
