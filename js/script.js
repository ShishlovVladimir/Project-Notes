const model = {
  notes: [],

  // colors: {
  //   green: "#000",
  //   blue: "#7DE1F3",
  //   red: "#F37D7D",
  //   yellow: "#F3DB7D",
  //   purple: "#E77DF3",
  // },

  addNotes(title, description, color) {
    //color = this.colors[color];
    const id = new Date().getTime();
    const favorites = false;
    const newNote = { id, title, description, favorites, color };
    this.notes.unshift(newNote);
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
    const radios = document.querySelectorAll(".radio");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const title = inputTitle.value;
      const description = inputDescription.value;
      let color;
      for (let radio of radios) {
        if (radio.checked) {
          color = getComputedStyle(radio).backgroundColor;
          console.log(color);
        }
      }

      controller.addNotes(title, description, color);
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

    notes.forEach((note) => {
      notesHTML += `
        <li id="${note.id}" class="list__item ">
          <div class="list__item-header" style="background-color: ${note.color}">
            <p class="list__title">${note.title}</p>
            <div class="list__buttons">
              <button class="list__favorites-button" type="button">
                <img class="${note.favorites ? "hidden" : ""}"  src="../img/heart_inactive.png" alt="heart" >
                <img class="${note.favorites ? "" : "hidden"}"  src="../img/heart_active.png" alt="black heart">
              </button>
              <button class="list__delete-button" type="button"><img  src="../img/delete.svg" alt="heart" ></button>
            </div>
          </div>
          <p class="list__description">${note.description}</p>
        </li>
      `;
    });

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
    const messageBox = document.querySelector(".notes__message-box");
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
  addNotes(title, description, color) {
    if (title.length > 50) {
      view.displayMessage("Максимальная длина заголовка - 50 символов", true);
    } else {
      if (title.trim() !== "" && description.trim() !== "") {
        model.addNotes(title, description, color);
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
