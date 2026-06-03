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

// Clients System Logic
const clientsModal = document.getElementById('clients-modal');
const manageClientsBtn = document.getElementById('manage-clients-btn');
const closeClientsBtn = document.getElementById('close-clients-btn');
const toggleClientFormBtn = document.getElementById('toggle-client-form-btn');
const clientFormContainer = document.getElementById('client-form-container');
const clientsList = document.getElementById('clients-list');
const saveClientBtn = document.getElementById('save-client-btn');
const cancelClientBtn = document.getElementById('cancel-client-btn');
const clientNameInput = document.getElementById('client-name');
const clientAmountInput = document.getElementById('client-amount');
const clientDateInput = document.getElementById('client-date');
const clientStatusSelect = document.getElementById('client-status');
const clientNoteInput = document.getElementById('client-note');
const clientActiveCheck = document.getElementById('client-active');
const clientIdInput = document.getElementById('client-id');
const todoClientSelect = document.getElementById('todo-client');

let clients = [];
try {
  const stored = localStorage.getItem('fahad_clients_data');
  clients = stored ? JSON.parse(stored) : null;
  if (!Array.isArray(clients)) clients = null;
} catch (e) {
  console.error('Error loading clients:', e);
  clients = null;
}

if (!clients || clients.length === 0) {
  clients = [
    { id: Date.now(), name: 'General', amount: 0, active: true }
  ];
  saveClients();
}

function saveClients() {
  try {
    localStorage.setItem('fahad_clients_data', JSON.stringify(clients));
  } catch (e) {
    console.warn('Could not save clients to localStorage:', e);
  }
}

function renderClients() {
  if (!clientsList) return;
  clientsList.innerHTML = '';
  
  if (clients.length === 0) {
    clientsList.innerHTML = `<div style="text-align:center; color:#9ca3af; margin-top:40px;">No clients found.</div>`;
  } else {
    clients.forEach(client => {
      const div = document.createElement('div');
      div.className = `client-item ${!client.active ? 'inactive' : ''}`;
      
      let extraHtml = '';
      if (client.status) {
        let statusColor = client.status === 'Delivered' ? '#10b981' : (client.status === 'In Progress' ? '#3b82f6' : '#f59e0b');
        extraHtml += `<span style="font-size:11px; padding:2px 8px; border-radius:10px; background:rgba(255,255,255,0.05); color:${statusColor}; border:1px solid ${statusColor}33; margin-right:8px;">${client.status}</span>`;
      }
      if (client.date) {
        const today = new Date();
        today.setHours(0,0,0,0);
        const delDate = new Date(client.date);
        const diffTime = delDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let daysText = diffDays > 0 ? `${diffDays} days left` : (diffDays === 0 ? 'Due today' : `${Math.abs(diffDays)} days overdue`);
        let daysColor = diffDays >= 0 ? '#9ca3af' : '#ef4444';
        extraHtml += `<span style="font-size:11px; color:${daysColor};"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:2px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${daysText}</span>`;
      }
      
      let noteHtml = '';
      if (client.note) {
        noteHtml = `<div style="font-size:12px; color:#9ca3af; margin-top:6px; font-style:italic;">${client.note}</div>`;
      }
      
      div.innerHTML = `
        <div class="client-info">
          <div style="display:flex; align-items:center; flex-wrap:wrap; gap:4px;">
            <span class="client-name-display">${client.name} ${!client.active ? '(Inactive)' : ''}</span>
            <span class="client-amount-display" style="margin-left:8px;">$${client.amount || 0}</span>
          </div>
          <div style="margin-top:4px;">${extraHtml}</div>
          ${noteHtml}
        </div>
        <div class="client-actions">
          <button class="todo-btn-icon client-btn-edit" data-action="edit-client" data-id="${client.id}" title="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="todo-btn-icon" data-action="delete-client" data-id="${client.id}" title="Delete">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      `;
      clientsList.appendChild(div);
    });
  }

  if (todoClientSelect) {
    const currentVal = todoClientSelect.value;
    
    let optionsHtml = '<option value="">Select Client</option>';
    const activeClients = clients.filter(c => c.active);
    activeClients.forEach(c => {
      optionsHtml += `<option value="${c.name}">${c.name}</option>`;
    });
    todoClientSelect.innerHTML = optionsHtml;
    
    if (currentVal && activeClients.find(c => c.name === currentVal)) {
      todoClientSelect.value = currentVal;
    }
  }
}

function resetClientForm() {
  if(clientIdInput) clientIdInput.value = '';
  if(clientNameInput) clientNameInput.value = '';
  if(clientAmountInput) clientAmountInput.value = '';
  if(clientDateInput) clientDateInput.value = '';
  if(clientStatusSelect) clientStatusSelect.value = '';
  if(clientNoteInput) clientNoteInput.value = '';
  if(clientActiveCheck) clientActiveCheck.checked = true;
  if(cancelClientBtn) cancelClientBtn.classList.add('hidden');
  if(clientFormContainer) clientFormContainer.classList.add('hidden');
}

if (manageClientsBtn) {
  manageClientsBtn.addEventListener('click', () => {
    clientsModal.classList.remove('hidden');
    renderClients();
  });
}

if (toggleClientFormBtn) {
  toggleClientFormBtn.addEventListener('click', () => {
    if (clientFormContainer) {
      if (clientFormContainer.classList.contains('hidden')) {
        clientFormContainer.classList.remove('hidden');
        if (clientNameInput) clientNameInput.focus();
      } else {
        resetClientForm();
      }
    }
  });
}

if (closeClientsBtn) {
  closeClientsBtn.addEventListener('click', () => {
    clientsModal.classList.add('hidden');
    resetClientForm();
  });
}

if (clientsModal) {
  clientsModal.addEventListener('click', (e) => {
    if (e.target === clientsModal) {
      clientsModal.classList.add('hidden');
      resetClientForm();
    }
  });
}

if (saveClientBtn) {
  saveClientBtn.addEventListener('click', () => {
    const name = clientNameInput.value.trim();
    const amount = parseFloat(clientAmountInput.value) || 0;
    const date = clientDateInput ? clientDateInput.value : '';
    const status = clientStatusSelect ? clientStatusSelect.value : '';
    const note = clientNoteInput ? clientNoteInput.value.trim() : '';
    const active = clientActiveCheck.checked;
    const id = clientIdInput.value;

    if (!name) return;

    if (id) {
      const client = clients.find(c => c.id === parseInt(id, 10));
      if (client) {
        client.name = name;
        client.amount = amount;
        client.date = date;
        client.status = status;
        client.note = note;
        client.active = active;
      }
    } else {
      clients.push({
        id: Date.now(),
        name,
        amount,
        date,
        status,
        note,
        active
      });
    }

    saveClients();
    renderClients();
    resetClientForm();
  });
}

if (cancelClientBtn) {
  cancelClientBtn.addEventListener('click', resetClientForm);
}

if (clientsList) {
  clientsList.addEventListener('click', (e) => {
    const target = e.target;
    
    if (target.getAttribute('data-action') === 'delete-client' || target.closest('[data-action="delete-client"]')) {
      const btn = target.getAttribute('data-action') === 'delete-client' ? target : target.closest('[data-action="delete-client"]');
      const id = parseInt(btn.getAttribute('data-id'), 10);
      if (confirm('Are you sure you want to delete this client?')) {
        clients = clients.filter(c => c.id !== id);
        saveClients();
        renderClients();
      }
    }

    if (target.getAttribute('data-action') === 'edit-client' || target.closest('[data-action="edit-client"]')) {
      const btn = target.getAttribute('data-action') === 'edit-client' ? target : target.closest('[data-action="edit-client"]');
      const id = parseInt(btn.getAttribute('data-id'), 10);
      const client = clients.find(c => c.id === id);
      if (client) {
        clientIdInput.value = client.id;
        clientNameInput.value = client.name;
        clientAmountInput.value = client.amount || '';
        if(clientDateInput) clientDateInput.value = client.date || '';
        if(clientStatusSelect) clientStatusSelect.value = client.status || '';
        if(clientNoteInput) clientNoteInput.value = client.note || '';
        clientActiveCheck.checked = client.active;
        cancelClientBtn.classList.remove('hidden');
        if(clientFormContainer) clientFormContainer.classList.remove('hidden');
      }
    }
  });
}

// Initialize on DOM ready to comply with CSP perfectly
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setGreeting();
  renderClients();
  renderTodos();
});
