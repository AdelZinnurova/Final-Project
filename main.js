const colors = {
    GREEN: '#C2F37D',
    BLUE: '#7DE1F3',
    RED: '#F37D7D',
    YELLOW: '#F3DB7D',
    PURPLE: '#E77DF3'
}

const MOCK_NOTES = [
    {
        id: 1,
        title: 'Работа с формами',
        content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
        color: colors.GREEN,
        isFavorite: false,
    },
    {
        id: 2,
        title: 'Flexbox (CSS)',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        color: colors.YELLOW,
        isFavorite: false,
    }
    // ...
]


const model = {
    notes: [],

    addNote(title, content, color) {
        const newNote = {id: new Date().getTime(), title: title, content: content, color: color, isFavorite: false}
        this.notes.unshift(newNote);

        view.renderNotes(this.notes);
    },

    delete(noteId) {
        this.notes = this.notes.filter((note) => note.id !== noteId);
        view.renderNotes(this.notes);
    }
}


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

            // получаем данные из полей формы
            // передаем данные в контроллер

            event.preventDefault() // Предотвращаем стандартное поведение формы
            const title = inputTitle.value.trim()// смотрим название заметки
            const content = inputDescription.value.trim() // смотрим описание заметки
            const color = document.querySelector('.radio:checked')?.value || ''; // Получаем выбранный цвет // смотрим выбранный цвет заметки

            if (controller.addNote(title, content, color)) {
                inputTitle.value = ''
                inputDescription.value = ''
                // inputColor.value = ''
                inputColor.checked = false;
            }
        })

        const ul = document.querySelector('.notes-list')
        ul.addEventListener('click', (event) => {
            if(event.target.classList.contains('delete-button')){
                const noteId = +event.target.closest('.note').id;
                controller.delete(noteId)
            }
        })
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
            notesHTML += `
        <li id="${note.id}" class="note">
            <div class="note-title" style="background-color: ${note.color}">
                <span>${note.title}</span>
                <div class="note-actions">
                    <button class="add-to-favourites" aria-label="Добавить в избранное"></button>
                    <button class="delete-button" aria-label="Удалить заметку"></button>
                </div>
            </div>
        <p class="note-content">${note.content}</p>
        </li>
        `
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
    }
}

function init() {
    view.init()
}

init()
