export default class NotesAPI {
  static getAllNotes() {
    const savedNotes = JSON.parse(localStorage.getItem("notes-app")) || [];
    return savedNotes.sort((a, b) => {
      return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
    });
  }

  static saveNote(noteToSave) {
    const notes = this.getAllNotes();
    const existNote = notes.find((note) => note.id == noteToSave.id);
    if (existNote) {
      existNote.updated = new Date().toISOString();
      existNote.title = noteToSave.title;
      existNote.body = noteToSave.body;
    } else {
      noteToSave.id = new Date().getTime();
      noteToSave.updated = new Date().toISOString();
      console.log(noteToSave.updated);
      notes.push(noteToSave);
      console.log(notes);
    }
    localStorage.setItem("notes-app", JSON.stringify(notes));
  }

  static deleteNote(noteId) {
    const notes = this.getAllNotes();
    const filterNotes = notes.filter((note) => note.id != noteId);
    localStorage.setItem("notes-app", JSON.stringify(filterNotes));
  }
}
