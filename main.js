const colors = {
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    YELLOW: 'yellow',
    PURPLE: 'purple'
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
        const inputColor = document.querySelector('.radio')

        form.addEventListener('submit', (event) => {

            // получаем данные из полей формы
            // передаем данные в контроллер

            event.preventDefault() // Предотвращаем стандартное поведение формы
            const title = inputTitle.value // смотрим название заметки
            const content = inputDescription.value // смотрим описание заметки
            const color = inputColor.value; // смотрим выбранный цвет заметки

            controller.addNote(title, content, color)

            inputTitle.value = ''
            inputDescription.value = ''
            inputColor.value = ''
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
        <b class="note-title">${note.title}</b>
        <p class="note-content">${note.content}</p>
        </li>
        `
        }
        list.innerHTML = notesHTML
        this.renderNotesCount(notes); // Обновляем количество заметок
    },

    renderNotesCount(notes){

        const countNotes = document.querySelector('.note-count')
        countNotes.textContent = notes.length; // Устанавливаем текст равный количеству заметок
    },

    showMessage(message) {
        const messagesBox = document.querySelector('.messages-box')
        messagesBox.textContent = message
        messagesBox.classList.add('note-added')
    }
}


const controller = {
    addNote(title, content, color) {
        if (title.trim() !== '' && content.trim() !== '') {
            model.addNote(title, content, color)
            view.showMessage('Заметка добавлена!')
        }
    }
}






function init() {
    view.init()
}

init()
