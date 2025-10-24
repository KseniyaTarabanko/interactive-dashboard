import { UIComponent } from './UIComponent.js';

export class ToDoWidget extends UIComponent {
    constructor(config = {}) {
        super({
            title: config.title || '📝 Список дел',
            id: config.id
        });
        this.tasks = config.tasks || [];
    }

    renderContent() {
        return `
            <div class="todo-widget">
                <div class="todo-input">
                    <input type="text" placeholder="Новая задача..." class="todo-new-input">
                    <button class="todo-add-btn">Добавить</button>
                </div>
                <ul class="todo-list">
                    ${this.renderTasks()}
                </ul>
            </div>
        `;
    }

    renderTasks() {
        return this.tasks.map((task, index) => `
            <li class="todo-item ${task.completed ? 'completed' : ''}" data-index="${index}">
                <input type="checkbox" ${task.completed ? 'checked' : ''} class="todo-checkbox">
                <span class="todo-text">${task.text}</span>
                <div class="todo-actions">
                    <button class="control-btn delete-btn" title="Удалить">🗑️</button>
                </div>
            </li>
        `).join('');
    }

    bindEvents() {
        super.bindEvents();
        
        const addBtn = this.element.querySelector('.todo-add-btn');
        const input = this.element.querySelector('.todo-new-input');
        const todoList = this.element.querySelector('.todo-list');

        addBtn.addEventListener('click', () => this.addTask());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('todo-checkbox')) {
                const index = parseInt(e.target.closest('.todo-item').dataset.index);
                this.toggleTask(index);
            } else if (e.target.classList.contains('delete-btn')) {
                const index = parseInt(e.target.closest('.todo-item').dataset.index);
                this.deleteTask(index);
            }
        });
    }

    addTask() {
        const input = this.element.querySelector('.todo-new-input');
        const text = input.value.trim();
        
        if (text) {
            this.tasks.push({ text, completed: false });
            input.value = '';
            this.updateTasks();
        }
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.updateTasks();
    }

    toggleTask(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.updateTasks();
    }

    updateTasks() {
        const todoList = this.element.querySelector('.todo-list');
        todoList.innerHTML = this.renderTasks();
    }
}