model = {
  notes: [],

  addNotes(title, description) {
    const id = new Date().getTime();
    const favorites = false;
    const newNote = { id, title, description, favorites };
    this.notes.push(newNote);
  },

  deleteNotes(noteId) {
    this.notes = this.notes.filter((note) => note.id !== +noteId);
  },

  addNotesInFavorites(noteId) {
    this.notes = this.notes.map((note) => {
      if (note.id === +noteId) {
        note.favorites = !note.favorites;
      }
      return note;
    });
  },
  //
  //
  // resetListFromDone() {
  //   this.tasks = this.tasks.filter((task) => task.isDone === false);
  //
  //   view.renderTasks(model.tasks);
  // },
};

const view = {
  init() {
    this.renderNotes(model.notes);

    const form = document.querySelector(".notes__form");
    const inputTitle = document.querySelector(".form__title");
    const inputDescription = document.querySelector(".form__description");
    const list = document.querySelector(".notes__list");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const title = inputTitle.value;
      const description = inputDescription.value;
      controller.addNotes(title, description);
    });

    list.addEventListener(`click`, function (event) {
      if (event.target.closest(".list__delete-button")) {
        const elementList = event.target.closest(".list__item");
        const noteId = elementList.id;
        controller.deleteNotes(noteId);
      }
    });

    list.addEventListener(`click`, function (event) {
      if (event.target.closest(".list__favorites-button")) {
        const elementList = event.target.closest(".list__item");
        const noteId = elementList.id;
        controller.addNotesInFavorites(noteId);
      }
    });
  },

  renderNotes(notes) {
    const list = document.querySelector(".notes__list");
    let notesHTML = "";
    const arrayElementsList = [];
    notes.forEach((note) => {
      notesHTML = `
        <li id="${note.id}" class="list__item ">
          <div class="list__item-header">
            <p class="list__title">${note.title}</p>
            <div class="list__buttons">
              <button class="list__favorites-button" type="button">
                <img class="${note.favorites ? "hidden" : ""}"  src="../img/heart_desable.svg" alt="heart" >
                <img class="${note.favorites ? "" : "hidden"}"  src="../img/heart_active.svg" alt="black heart">
              </button>
              <button class="list__delete-button" type="button"><img  src="../img/delete.svg" alt="heart" ></button>
            </div>
          </div>
          <p class="list__description">${note.description}</p>
        </li>
      `;
      arrayElementsList.unshift(notesHTML);
    });
    notesHTML = arrayElementsList.join("");

    list.innerHTML = notesHTML;
    
    if (list.innerHTML === ``) {
      list.innerHTML = `У вас ещё нет ни одной заметки. Заполните поля выше и создайте свою первую заметку!`;
    }

    // Счетчик
    const countNotes = document.querySelector(".count");
    countNotes.textContent = ``;

    let count = notes.length;
    countNotes.textContent = count.toString();
  },

  displayMessage(message, isError = false) {
    const messageBox = document.querySelector(".note__message-box");
    messageBox.textContent = message;

    if (isError) {
      messageBox.classList.remove("success");
      messageBox.classList.add("error");
    } else {
      messageBox.classList.remove("error");
      messageBox.classList.add("success");
      setTimeout(() => {
        messageBox.textContent = "";
      }, 3000);
    }
  },

  clearForm() {
    const inputTitle = document.querySelector(".form__title");
    const inputDescription = document.querySelector(".form__description");
    inputTitle.value = "";
    inputDescription.value = "";
  },
};

const controller = {
  addNotes(title, description) {
    if (title.length > 50) {
      view.displayMessage("Максимальная длина заголовка - 50 символов", true);
    } else {
      if (title.trim() !== "" && description.trim() !== "") {
        model.addNotes(title, description);
        view.clearForm();
        view.renderNotes(model.notes);
        view.displayMessage("Заметка добавлена!");
      } else {
        view.displayMessage("Заполните все поля!", true);
      }
    }
  },
  deleteNotes(noteId) {
    model.deleteNotes(noteId);
    view.displayMessage("Заметка удалена");
    view.renderNotes(model.notes);
  },

  addNotesInFavorites(noteId) {
    model.addNotesInFavorites(noteId);
    view.renderNotes(model.notes);
  },

  //   resetListFromDone() {
  //     model.resetListFromDone();
  //   },
};

function init() {
  view.init();
}

init();
