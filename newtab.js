// newtab.js

// Mouse glow effect
const bg = document.getElementById('background');

document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  bg.style.setProperty('--mouse-x', `${x}%`);
  bg.style.setProperty('--mouse-y', `${y}%`);
});

// Live Clock
function updateClock() {
  const timeEl = document.getElementById('live-time');
  if (!timeEl) return;
  setInterval(() => {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    timeEl.textContent = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }, 1000);
}

// Dynamic Greeting
function setGreeting() {
  const greetingEl = document.getElementById('greeting');
  if (!greetingEl) return;
  
  const hour = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })).getHours();
  let greeting = '';
  if (hour < 5) greeting = "Good night, Fahad.";
  else if (hour < 12) greeting = "Good morning, Fahad.";
  else if (hour < 17) greeting = "Good afternoon, Fahad.";
  else greeting = "Good evening, Fahad.";

  greetingEl.textContent = greeting;
}

// Fix Avatar Error (CSP Compliant instead of inline onerror)
const profileImg = document.getElementById('profile-img');
if (profileImg) {
  profileImg.addEventListener('error', () => {
    profileImg.src = 'https://picsum.photos/id/64/400/400';
  });
}

// Todo System Logic
const todoClientInput = document.getElementById('todo-client');
const todoTaskInput = document.getElementById('todo-task');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

let todos = [];
try {
  const stored = localStorage.getItem('fahad_client_todos');
  todos = stored ? JSON.parse(stored) : null;
  if (!Array.isArray(todos)) todos = null;
} catch (e) {
  console.error('Error loading todos:', e);
  todos = null;
}

if (!todos || todos.length === 0) {
  todos = [
    { id: Date.now(), client: 'Welcome!', text: 'Add your first task below 🚀', completed: false }
  ];
}

function saveTodos() {
  try {
    localStorage.setItem('fahad_client_todos', JSON.stringify(todos));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
}

function renderTodos() {
  if (!todoList) return;
  todoList.innerHTML = '';
  
  if (todos.length === 0) {
    todoList.innerHTML = `
      <div style="text-align:center; color:#9ca3af; margin-top:80px; display:flex; flex-direction:column; align-items:center; gap:16px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path></svg>
        <span style="font-size: 16px; font-weight:500;">No tasks yet. You're all caught up!</span>
      </div>`;
    return;
  }
  
  const sortedTodos = [...todos].sort((a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1);

  sortedTodos.forEach(todo => {
    const div = document.createElement('div');
    div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    div.innerHTML = `
      <input type="checkbox" class="todo-checkbox" data-action="toggle" data-id="${todo.id}" ${todo.completed ? 'checked' : ''}>
      <div class="todo-content">
        ${todo.client ? `<span class="todo-client-badge">${todo.client}</span>` : ''}
        <span class="todo-text">${todo.text}</span>
      </div>
      <div class="todo-actions">
        <button class="todo-btn-icon" data-action="delete" data-id="${todo.id}" title="Delete Task">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    `;
    todoList.appendChild(div);
  });
}

// Event Delegation for CSP compliance
if (todoList) {
  todoList.addEventListener('click', (e) => {
    const target = e.target;
    // Handle delete button clicks
    if (target.getAttribute('data-action') === 'delete' || target.closest('[data-action="delete"]')) {
      const btn = target.getAttribute('data-action') === 'delete' ? target : target.closest('[data-action="delete"]');
      const id = parseInt(btn.getAttribute('data-id'), 10);
      todos = todos.filter(t => t.id !== id);
      saveTodos();
      renderTodos();
    }
  });

  todoList.addEventListener('change', (e) => {
    const target = e.target;
    if (target.getAttribute('data-action') === 'toggle') {
      const id = parseInt(target.getAttribute('data-id'), 10);
      const todo = todos.find(t => t.id === id);
      if (todo) {
        todo.completed = target.checked;
        saveTodos();
        renderTodos();
      }
    }
  });
}

function addTodo() {
  if (!todoClientInput || !todoTaskInput) return;
  const client = todoClientInput.value.trim();
  const text = todoTaskInput.value.trim();
  if (!text) return;

  todos.unshift({
    id: Date.now(),
    client: client,
    text: text,
    completed: false
  });
  
  // Keep the client name populated for faster sequential additions
  todoTaskInput.value = '';
  todoTaskInput.focus();
  
  saveTodos();
  renderTodos();
}

if (addTodoBtn) {
  addTodoBtn.addEventListener('click', addTodo);
}

if (todoTaskInput) {
  todoTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
  });
}

if (todoClientInput) {
  todoClientInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      if (todoTaskInput) todoTaskInput.focus();
    }
  });
}

// Initialize on DOM ready to comply with CSP perfectly
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setGreeting();
  renderTodos();
});
