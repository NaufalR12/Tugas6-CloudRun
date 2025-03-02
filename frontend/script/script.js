const apiUrl = "http://localhost:5000/api/notes";

document.getElementById("addNoteBtn").addEventListener("click", () => {
  document.getElementById("formTitle").innerText = "New Note";
  document.getElementById("noteId").value = "";
  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";
  document.getElementById("noteForm").classList.remove("hidden");
});

document.getElementById("cancelForm").addEventListener("click", () => {
  document.getElementById("noteForm").classList.add("hidden");
});

function formatDate(isoString) {
  const date = new Date(isoString);
  return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}, ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
}

function loadNotes() {
  axios.get(apiUrl).then((response) => {
    const notesContainer = document.getElementById("notesContainer");
    const searchInput = document
      .getElementById("searchInput")
      .value.toLowerCase();

    const colors = [
      "bg-blue-800",
      "bg-green-800",
      "bg-red-800",
      "bg-yellow-800",
      "bg-purple-800",
      "bg-indigo-800",
      "bg-pink-800",
      "bg-blue-600",
      "bg-green-600",
      "bg-red-600",
      "bg-yellow-600",
      "bg-purple-600",
      "bg-indigo-600",
      "bg-pink-600",
    ];

    let noteColors = JSON.parse(sessionStorage.getItem("noteColors")) || {};
    let availableColors = JSON.parse(
      sessionStorage.getItem("availableColors")
    ) || [...colors];

    function getUniqueColor() {
      if (availableColors.length === 0) {
        availableColors = [...colors];
      }
      const colorIndex = Math.floor(Math.random() * availableColors.length);
      return availableColors.splice(colorIndex, 1)[0];
    }

    notesContainer.innerHTML = "";
    response.data
      .filter(
        (note) =>
          note.title.toLowerCase().includes(searchInput) ||
          note.content.toLowerCase().includes(searchInput)
      )
      .forEach((note) => {
        if (!noteColors[note.id]) {
          noteColors[note.id] = getUniqueColor();
        }

        const noteDiv = document.createElement("div");
        noteDiv.className = `${
          noteColors[note.id]
        } p-4 rounded-lg flex flex-col h-auto`;
        noteDiv.innerHTML = `
          <h3 class="text-lg font-bold">${note.title}</h3>
          <div class="note-content grow break-words">${marked.parse(
            note.content
          )}</div>
          <small class="mt-2 block text-white">${formatDate(
            note.created_at
          )}</small>
          <div class="flex justify-end space-x-2 mt-2">
            <button onclick="editNote(${note.id}, '${
          note.title
        }', '${encodeURIComponent(note.content)}')" 
                    class="text-blue-400 hover:text-yellow-300">
              <i class="fas fa-pen"></i>
            </button>
            <button onclick="deleteNote(${
              note.id
            })" class="text-red-700 hover:text-red-400">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
        notesContainer.appendChild(noteDiv);
      });

    sessionStorage.setItem("noteColors", JSON.stringify(noteColors));
    sessionStorage.setItem("availableColors", JSON.stringify(availableColors));
  });
}

document.getElementById("searchInput").addEventListener("input", loadNotes);

function editNote(id, title, content) {
  content = decodeURIComponent(content);
  document.getElementById("formTitle").innerText = "Edit Note";
  document.getElementById("noteId").value = id;
  document.getElementById("noteTitle").value = title;
  document.getElementById("noteContent").value = content;
  document.getElementById("noteForm").classList.remove("hidden");
}

function deleteNote(id) {
  axios.delete(`${apiUrl}/${id}`).then(() => loadNotes());
}

document.getElementById("saveNote").addEventListener("click", () => {
  const id = document.getElementById("noteId").value;
  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;

  if (id) {
    axios.put(`${apiUrl}/${id}`, { title, content }).then(() => {
      loadNotes();
      document.getElementById("noteForm").classList.add("hidden");
    });
  } else {
    axios.post(apiUrl, { title, content }).then(() => {
      loadNotes();
      document.getElementById("noteForm").classList.add("hidden");
    });
  }
});

loadNotes();
