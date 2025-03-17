const MOCK_NOTES = [
  {
    id: 1,
    title: "Работа с формами",
    content:
      "К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name",
    color: "yellow",
    isFavorite: false,
  },
  {
    id: 2,
    title: "Отдых",
    content: "fdg;kdfgfdgdfgdgdgdfgdgdfgdg gdfg d  gfd gdg df gd dg d d ",
    color: "green",
    isFavorite: false,
  },
];

const model = {
  notes: MOCK_NOTES,
  notesFavorites: [],

  isShowOnlyFavorite: false,
  toggleShowOnlyFavorite() {
    this.isShowOnlyFavorite = !this.isShowOnlyFavorite;
  },
  updateNotesFavorites() {
    console.log(this.isShowOnlyFavorite);
    this.toggleShowOnlyFavorite();
    if (this.isShowOnlyFavorite) {
      this.notesFavorites = this.notes.filter((note) => note.favorites);
      //console.log(this.notesFavorites);
      view.renderNotes(this.notesFavorites);
      view.renderNotesCount(this.notes);
    } else {
      view.renderNotes(this.notes);
      view.renderNotesCount(this.notes);
    }
  },

  addNotes(title, description, color) {
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
};

const view = {
  init() {
    this.renderNotes(model.notes);
    this.renderNotesCount(model.notes);

    const form = document.querySelector(".notes__form");
    const inputTitle = document.querySelector(".form__title");
    const inputDescription = document.querySelector(".form__description");
    const list = document.querySelector(".notes__list");
    const radios = document.querySelectorAll(".radio");
    const favoritesCheckboxInput = document.querySelector(
      ".favorites-checkbox__input",
    );

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const title = inputTitle.value;
      const description = inputDescription.value;
      let color;
      for (let radio of radios) {
        if (radio.checked) {
          color = getComputedStyle(radio).backgroundColor;
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

    favoritesCheckboxInput.addEventListener(`click`, function () {
      model.updateNotesFavorites();
    });
  },

  renderNotes(notes) {
    const favoritesCheckbox = document.querySelector(".favorites-checkbox");
    const list = document.querySelector(".notes__list");
    let notesHTML = "";
    //console.log(`render`, notes);
    notes.forEach((note) => {
      notesHTML += `
        <li id="${note.id}" class="list__item ">
          <div class="list__item-header" style="background-color: ${note.color}">
            <p class="list__title">${note.title}</p>
            <div class="list__buttons">
              <div class="list__favorites-button">
                <img class="${note.favorites ? "hidden" : ""}"  src="../img/heart_desable.svg" alt="heart" >
                <img class="${note.favorites ? "" : "hidden"}"  src="../img/heart_active.svg" alt="black heart">
              </div>
              <div class="list__delete-button" ><img  src="../img/delete.svg" alt="heart" ></div>
            </div>
          </div>
          <p class="list__description">${note.description}</p>
        </li>
      `;
    });

    list.innerHTML = notesHTML;

    if (list.innerHTML === ``) {
      list.innerHTML = `У вас ещё нет ни одной заметки. Заполните поля выше и создайте свою первую заметку!`;
      favoritesCheckbox.classList.add("hidden");
    } else {
      favoritesCheckbox.classList.remove("hidden");
    }

    //Сброс цвета на первый элемент
    const radioList = document.querySelector(".radio-list>li>input");
    radioList.checked = true;
  },

  renderNotesCount(notes) {
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
        view.renderNotesCount(model.notes);
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
    view.renderNotesCount(model.notes);
  },

  addNotesInFavorites(noteId) {
    model.addNotesInFavorites(noteId);
    view.renderNotes(model.notes);
  },
};

function init() {
  view.init();
}

init();
