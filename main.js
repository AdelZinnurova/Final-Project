
// -------------------------------------
//              MODEL
// -------------------------------------

const model = {
    notes: [],
    isShowOnlyFavorite: false,

    addNote(title, content, color) {
        const newNote = {id: new Date().getTime(), title: title, content: content, color: color, isFavorite: false}
        this.notes.unshift(newNote);

        view.renderNotes(this.notes);
    },

    delete(noteId) {
        this.notes = this.notes.filter((note) => note.id !== noteId);
        view.renderNotes(this.notes);
    },

    // Переключение флага избранного
    toggleFavorite(noteId) {
        const note = this.notes.find((note) => note.id === noteId);
        if (note) {
            note.isFavorite = !note.isFavorite;
        }
        this.updateNotesView();
    },

    // Установить/снять флаг «показывать только избранные»
    toggleShowOnlyFavorite(isShowOnlyFavorite) {
        this.isShowOnlyFavorite = isShowOnlyFavorite;
        this.updateNotesView();
    },

    // Обновить отображение заметок
    updateNotesView() {
        let notesToRender = this.notes;
        if (this.isShowOnlyFavorite) {
            notesToRender = notesToRender.filter(note => note.isFavorite);
        }
        view.renderNotes(notesToRender);
        view.renderNotesCount(notesToRender);
    }

}

// -------------------------------------
//                VIEW
// -------------------------------------

const view = {
    init() {
        this.renderNotes(model.notes)
        this.renderNotesCount(model.notes)

        //Обработчик события для добавления заметок
        const form = document.querySelector('.form')
        const inputTitle = document.querySelector('.notesNameText')
        const inputDescription = document.querySelector('.notesDescriptionText')
        const inputColor = document.querySelector('.radio:checked');

        form.addEventListener('submit', (event) => {
            event.preventDefault() // Предотвращаем стандартное поведение формы
            const title = inputTitle.value.trim()// смотрим название заметки
            const content = inputDescription.value.trim() // смотрим описание заметки
            const color = document.querySelector('.radio:checked')?.value || ''; // смотрим выбранный цвет заметки

            if (controller.addNote(title, content, color)) {
                inputTitle.value = ''
                inputDescription.value = ''
                inputColor.checked = false;
            }
        })

        //Обработчик события для удаления заметок
        const ul = document.querySelector('.notes-list')
        ul.addEventListener('click', (event) => {
            if(event.target.classList.contains('delete-button')){
                const noteId = +event.target.closest('.note').id;
                controller.delete(noteId)
            }
        })

        //Обработчик события добавление/удаление из избранного
        ul.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-favourites')
                || event.target.closest('.add-to-favourites')) {
                const button = event.target.closest('.add-to-favourites');
                const noteId = +button.closest('.note').id;
                controller.toggleFavorite(noteId);
            }
        });

        // Чекбокс «Показать только избранные»
        const favoritesCheckbox = document.querySelector('#favorites-filter');
        favoritesCheckbox.addEventListener('change', (event) => {
            controller.toggleShowOnlyFavorite(event.target.checked);
        });
    },

    renderNotes(notes) {

        const list = document.querySelector('.notes-list')
        const noNotes = document.querySelector('.TextNoNotes')

        if (notes.length === 0) {
            // Если заметок нет, очищаем список заметок и отображаем сообщение
            list.innerHTML = '';
            noNotes.innerHTML = `
                <p class="no-notes">
                    У вас нет еще ни одной заметки. <br> Заполните поля выше и создайте свою первую заметку!
                </p>
            `;
            this.renderNotesCount(notes); // Обновляем количество заметок
            return;
        }

        // Если заметки есть, очищаем сообщение и рендерим заметки
        noNotes.innerHTML = '';
        let notesHTML = ''

        for (let note of notes) {
            let favouritesClass = '';
            if (note.isFavorite) {
                favouritesClass = 'favourited';
            }

            notesHTML += `
                <li id="${note.id}" class="note">
                    <div class="note-title" style="background-color: ${note.color}">
                        <span>${note.title}</span>
                        <div class="note-actions">
                            <button 
                                class="add-to-favourites ${favouritesClass}" 
                                aria-label="Добавить/убрать из избранного"
                            ></button>
                            <button 
                                class="delete-button" 
                                aria-label="Удалить заметку"
                            ></button>
                        </div>
                    </div>
                    <p class="note-content">${note.content}</p>
                </li>
            `;
        }
        list.innerHTML = notesHTML
        this.renderNotesCount(notes); // Обновляем количество заметок
    },

    renderNotesCount(notes) {
        const countNotes = document.querySelector('.note-count')
        countNotes.textContent = notes.length; // Устанавливаем текст равный количеству заметок
    },

    showMessage(message, isError = false) {
        const messagesBox = document.querySelector('.messages-box')
        messagesBox.textContent = message
        if (isError) {
            messagesBox.classList.remove('success')
            messagesBox.classList.add('error')
        } else {
            messagesBox.classList.remove('error')
            messagesBox.classList.add('success')
        }
        messagesBox.style.display = 'block'; // Показываем сообщение

        // Скрываем сообщение через 3 секунды
        setTimeout(() => {
            messagesBox.style.display = 'none'; // Скрываем сообщение
        }, 3000);
    }
}

// -------------------------------------
//              CONTROLLER
// -------------------------------------

const controller = {
    addNote(title, content, color) {
        if (title.length > 50) {
            view.showMessage('Максимальная длина заголовка - 50 символов', true);
            return false; // Возвращаем false при ошибке;
        }
        if (title.trim() !== '' && content.trim() !== '') {
            model.addNote(title, content, color);
            view.showMessage('Заметка добавлена!');
            return true; // Возвращаем true при успешном добавлении
        } else {
            view.showMessage('Заполните все поля!', true);
            return false; // Возвращаем false при ошибке
        }
    },

    delete(noteId) {
        model.delete(noteId)
        view.showMessage('Заметка удалена!')
    },

    // Избранное
    toggleFavorite(noteId) {
        model.toggleFavorite(noteId);
    },

    // Включить/выключить «Показывать только избранные»
    toggleShowOnlyFavorite(isShowOnlyFavorite) {
        model.toggleShowOnlyFavorite(isShowOnlyFavorite);
    }
}

function init() {
    view.init()
}

init()
