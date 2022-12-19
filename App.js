import NotesView from "./NotesView.js";
import NotesAPI from "./NotesAPI.js";
export default class App {
  constructor(root) {
    this.root = root;
    this.createPageHtml();
    this.updateNotesList();

    const inputTitle = document.querySelector(".notes__title");
    const inputBody = document.querySelector(".notes__body");
    const addNote = document.querySelector(".notes__add");

    inputTitle.addEventListener("input", (e) => {
      const notesItem = [...document.querySelectorAll(".notes__list-item")];
      const selectedNote = notesItem.find((note) =>
        note.classList.contains("notes__list-item-selected")
      );
      selectedNote.firstElementChild.firstElementChild.textContent =
        e.target.value;
      // e.target.value.length < 10
      //   ? e.target.value
      //   : e.target.value.substring(0, 9);
      // console.log(selectedNote.firstElementChild.firstElementChild.textContent);
      const notes = NotesAPI.getAllNotes();
      const noteToSelecte = notes.find((note) => note.id == selectedNote.id);
      noteToSelecte.title = e.target.value;
      NotesAPI.saveNote(noteToSelecte);
      this.updateNotesList();
    });

    inputBody.addEventListener("input", (e) => {
      const notesItem = [...document.querySelectorAll(".notes__list-item")];
      const selectedNote = notesItem.find((note) =>
        note.classList.contains("notes__list-item-selected")
      );
      selectedNote.firstElementChild.nextElementSibling.textContent =
        e.target.value.length < 20
          ? e.target.value
          : e.target.value.substring(0, 19) + "...";
      const notes = NotesAPI.getAllNotes();
      const noteToSelecte = notes.find((note) => note.id == selectedNote.id);
      noteToSelecte.body = e.target.value;
      console.log(noteToSelecte.body);
      NotesAPI.saveNote(noteToSelecte);
      this.updateNotesList();
    });

    addNote.addEventListener("click", () => {
      const newNote = { title: "new title", body: "new Body" };
      NotesAPI.saveNote(newNote);
      this.updateNotesList();
    });
  }

  createPageHtml() {
    this.root.innerHTML = `<div class="notes__sidebar">
        <div class="notes__logo">NOTE APP</div>
        <div class="notes__list"> 
        </div>
        <button class="notes__add">Add Note</button>
      </div>
      <div class="notes__preview">
        <input type="text" class="notes__title" placeholder="Note Title" />
        <textarea class="notes__body">Take some notes</textarea>
      </div>`;
  }

  createNewNote(note) {
    const { id, title, body, updated } = note;
    const max_length_Body = 23;

    return `<div class="notes__list-item" id=${id}>
    <div class="notes__small-header">
      <h2 class="notes_small-title">${title.substring(0, 12)}</h2>
      <span class="notes__small-trash" data-id=${id}
        ><i class="fa-solid fa-trash-can" data-id=${id}></i
      ></span>
    </div>
    <div class="notes__small-body">
    ${body.substring(0, 22)}
    ${body.length > max_length_Body ? "..." : ""}
    </div>
    <div class="notes__small-updated">${new Date(updated).toLocaleString("en", {
      dateStyle: "full",
      timeStyle: "short",
    })}</div>
  </div>`;
  }

  updateNotesList() {
    const notesList = document.querySelector(".notes__list");
    const notesPreview = document.querySelector(".notes__preview");
    const notes = NotesAPI.getAllNotes();
    console.log(notes);
    notesList.innerHTML = "";
    notes.forEach((note) => {
      notesList.innerHTML += this.createNewNote(note);
    });
    if (notes.length > 0) {
      notesPreview.style.display = "flex";

      // select note
      const notesItem = [...document.querySelectorAll(".notes__list-item")];
      const inputTitle = document.querySelector(".notes__title");
      const inputBody = document.querySelector(".notes__body");

      notesItem[0].classList.add("notes__list-item-selected");

      inputTitle.value = notes.find((note) => note.id == notesItem[0].id).title;
      inputBody.value = notes.find((note) => note.id == notesItem[0].id).body;
      notesItem.forEach((noteItem) => {
        noteItem.addEventListener("click", () => {
          notesItem.forEach((note) =>
            note.classList.remove("notes__list-item-selected")
          );
          noteItem.classList.add("notes__list-item-selected");
          const selectedNote = notes.find((note) => note.id == noteItem.id);
          inputTitle.value = selectedNote.title;
          inputBody.value = selectedNote.body;
        });
      });

      // remove note
      const notesTrashList = document.querySelectorAll(".notes__small-trash");
      notesTrashList.forEach((note) => {
        note.addEventListener("click", (e) => {
          console.log(e.target.dataset.id);
          e.stopPropagation();
          NotesAPI.deleteNote(e.target.dataset.id);
          this.updateNotesList();
        });
      });
    } else {
      notesPreview.style.display = "none";
    }
  }
}
