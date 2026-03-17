class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        document.getElementById('add-task').addEventListener('click', () => this.addTask());
        document.getElementById('new-task').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
    }

    addTask() {
        const input = document.getElementById('new-task');
        const text = input.value.trim();
        if (text === '') {
            alert('Please enter a task!');
            return;
        }
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.todos.push(task);
        this.saveTodos();
        input.value = '';
        this.render();
    }

    deleteTask(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
    }

    toggleTask(id) {
        const task = this.todos.find(todo => todo.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTodos();
            this.render();
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadTodos() {
        const stored = localStorage.getItem('todos');
        return stored ? JSON.parse(stored) : [];
    }

    render() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        if (this.todos.length === 0) {
            taskList.innerHTML = '<div class="empty-message">No tasks yet. Add one to get started!</div>';
            return;
        }
        this.todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'task-item' + (todo.completed ? ' completed' : '');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => this.toggleTask(todo.id));
            const span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = todo.text;
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => this.deleteTask(todo.id));
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
        const stats = document.createElement('div');
        stats.className = 'stats';
        const completed = this.todos.filter(t => t.completed).length;
        stats.textContent = 'Total: ' + this.todos.length + ' | Completed: ' + completed + ' | Remaining: ' + (this.todos.length - completed);
        taskList.appendChild(stats);
    }
}

const app = new TodoApp();