const apiUrl = "http://localhost:8080/api/kids"; // Backend API endpoint

// Fetch and display all kids
function getKids() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const kidList = document.getElementById("kidList");
      kidList.innerHTML = ""; // Clear existing data
      data.content.forEach(kid => {
        kidList.innerHTML += `
          <div class="kid-card">
            <h3>${kid.kidName}</h3>
            <p><strong>School:</strong> ${kid.school}</p>
            <p><strong>Likes:</strong> ${kid.likes}</p>
            <p><strong>Filename:</strong> ${kid.filename}</p>
            <img src="${kid.imagePath}" alt="${kid.kidName}" class="preview-image"/>
            <button onclick="editKid(${kid.id})">Edit</button>
            <button onclick="deleteKid(${kid.id})">Delete</button>
          </div>
        `;
      });
    })
    .catch(error => console.error("Error fetching data:", error));
}

// Preview the selected image
function previewImage(event) {
  const file = event.target.files[0];
  const preview = document.getElementById("imagePreview");
  preview.innerHTML = ""; // Clear previous preview

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
}

// Save (add/update) kid data
function saveKid() {
  const kidId = document.getElementById("kidId").value;
  const kidName = document.getElementById("kidName").value;
  const school = document.getElementById("school").value;
  const likes = parseInt(document.getElementById("likes").value, 10);
  const filename = document.getElementById("filename").value;

  const imageFile = document.getElementById("imagePath").files[0];

  if (!imageFile) {
    alert("Please select an image!");
    return;
  }

  const formData = new FormData();
  formData.append("kidName", kidName);
  formData.append("school", school);
  formData.append("likes", likes);
  formData.append("filename", filename);
  formData.append("imageFile", imageFile);

  const method = kidId ? "PUT" : "POST";
  const url = kidId ? `${apiUrl}/${kidId}` : apiUrl;

  fetch(url, {
    method: method,
    body: formData
  })
    .then(response => {
      if (response.ok) {
        alert("Kid data saved successfully!");
        getKids();
        document.getElementById("kidForm").reset();
        document.getElementById("imagePreview").innerHTML = ""; // Clear image preview
      } else {
        alert("Failed to save kid data.");
      }
    })
    .catch(error => console.error("Error saving data:", error));
}

// Edit kid data
function editKid(id) {
  fetch(`${apiUrl}/${id}`)
    .then(response => response.json())
    .then(kid => {
      document.getElementById("kidId").value = kid.id;
      document.getElementById("kidName").value = kid.kidName;
      document.getElementById("school").value = kid.school;
      document.getElementById("likes").value = kid.likes;
      document.getElementById("filename").value = kid.filename;
      document.getElementById("imagePreview").innerHTML = `<img src="${kid.imagePath}" alt="${kid.kidName}"/>`;
    })
    .catch(error => console.error("Error fetching kid data:", error));
}

// Delete kid data
function deleteKid(id) {
  fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then(response => {
      if (response.ok) {
        alert("Kid data deleted successfully!");
        getKids();
      } else {
        alert("Failed to delete kid data.");
      }
    })
    .catch(error => console.error("Error deleting data:", error));
}
