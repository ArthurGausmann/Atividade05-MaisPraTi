class Task {
    constructor(todo, day, month, year, priority){
        this.todo = todo;
        this.day = day;
        this.month = month;
        this.year = year;
        this.priority = priority;
    }

    validateData() {
        for (let key in this) {
            if (this[key] === undefined || this[key] === "") {
                console.error(`The field ${key} is required.`);
                return false; // Retorna falso se algum campo estiver vazio ou indefinido
            }
        }
        return true; // Retorna verdadeiro se todos os campos forem válidos
    }
}

function registerTask() {
    const todo = document.getElementById('todo').value;
    const day = document.getElementById('day').value;
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    const priority = document.getElementById('priority').value;

    const task = new Task(todo, day, month, year, priority);

    if (task.validateData()) {
        database.createTask(task);
        alert('Tarefa registrada com sucesso!');
        resetForm(); // Limpa o formulário após o registro
        loadTasks();
    } else {
        alert('Por favor, preencha todos os campos.');
    }

    return false;
}

function resetForm() {
    document.getElementById("todo").value = '';
    document.getElementById("day").value = '';
    document.getElementById("month").value = '';
    document.getElementById("year").value = '';
    document.getElementById("priority").value = '';
}

// Função para carregar tarefas na lista de tarefas
function loadTasks(tasks = database.loadTasks()) {
    const listTasks = document.getElementById('listTasks');
    listTasks.innerHTML = ''; // Limpa a lista existente

    tasks.forEach((t) => {
        const row = listTasks.insertRow();

        row.insertCell(0).innerHTML = t.todo;
        row.insertCell(1).innerHTML = `${t.day}/${t.month}/${t.year}`;
        row.insertCell(2).innerHTML = t.priority;


        // Cria e adiciona o botão de deletar
        const btn = document.createElement('button');
        btn.className = 'btn btn-danger';
        btn.id = t.id;
        btn.innerHTML = 'Delete';
        btn.onclick = () => {
            if (confirm('Tem certeza que você deseja deletar essa tarefa?')) {
                database.removeTask(t.id);
                loadTasks(); // Atualiza a lista de tarefas
            }
        };

        row.insertCell(3).append(btn);
    });
}

class Database {
    constructor() {
        this.initDatabase();
    }

    // Inicializa o banco de dados no localStorage
    initDatabase() {
        const id = localStorage.getItem('id');
        if (id === null) {
            localStorage.setItem('id', '0'); // Inicializa o id no localStorage
        }
    }

    // Carrega todas as tarefas armazenadas no localStorage
    loadTasks() {
        const tasks = [];
        const id = localStorage.getItem('id');

        for (let i = 1; i <= id; i++) {
            try {
                const task = JSON.parse(localStorage.getItem(i));
                if (task !== null) {
                    task.id = i; // Adiciona o ID à tarefa para referência
                    tasks.push(task);
                }
            } catch (e) {
                console.error(`Error loading task with id ${i}:`, e);
            }
        }
        return tasks; // Retorna um array com todas as tarefas
    }

    // Cria uma nova tarefa no banco de dados
    createTask(task) {
        const id = this.getNextId();
        localStorage.setItem(id, JSON.stringify(task));
        localStorage.setItem('id', id.toString());
    }

    // Remove uma tarefa do banco de dados
    removeTask(id) {
        localStorage.removeItem(id);
    }

    // Obtém o próximo ID de tarefa disponível
    getNextId() {
        const currentId = localStorage.getItem('id');
        return parseInt(currentId) + 1;
    }
}

const database = new Database();