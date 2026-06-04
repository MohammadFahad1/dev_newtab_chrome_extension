# Coders Tab Home

A premium, highly personalized, and fully functional Chrome New Tab extension dashboard designed for developers and freelancers. It overrides the default new tab page to provide a beautiful, productive workspace with built-in task and client management systems.

## ✨ Features

- **Stunning Modern Aesthetic** — Dark theme with glassmorphism effects, dynamic glowing background that reacts to your cursor, and cyber-green accents.
- **Persistent Task Management System** — Create, toggle, and delete tasks. Task data is seamlessly stored and retrieved across sessions using `localStorage`. Tasks can be associated with specific clients.
- **Advanced Client Management** — Keep track of your clients, project amounts, delivery dates, current status (Pending, In Progress, Delivered), and active/inactive states. Includes an expandable client entry form.
- **Real-Time Live Clock** — A dynamic 12-hour format clock that reflects the accurate Asia/Dhaka timezone.
- **Smart Dynamic Greeting** — Automatically adjusts greetings based on the current time of day.
- **Quick Access Social Links** — Pre-configured, beautiful one-click access icons for your important platforms (GitHub, LinkedIn, Discord, WhatsApp, etc.).
- **Fully Responsive & Fast** — Built with raw HTML, CSS, and JavaScript. Zero external dependencies, meaning instant load times.
- **Strict Security & CSP Compliance** — Adheres strictly to browser Content Security Policy rules by separating logic, styles, and using event delegation to handle UI interactions dynamically.

## 🛠 Technology Stack

- **HTML5**: Semantic and clean structuring.
- **CSS3 (Vanilla)**: Custom properties (variables), Flexbox/Grid layouts, glassmorphism, responsive media queries, and smooth animations.
- **JavaScript (Vanilla)**: LocalStorage manipulation, DOM manipulation, timezone calculations, and array processing.
- **Chrome Extensions API**: Used `chrome_url_overrides` for a seamless new tab replacement.

## 🚀 Installation & Setup Instructions

### Load as an Unpacked Extension (Recommended)

1. **Clone or download this repository** to your local machine.
   ```bash
   git clone https://github.com/MohammadFahad1/dev_newtab_chrome_extension.git
   ```
2. Open your Google Chrome browser and navigate to the Extensions page:
   - Type `chrome://extensions/` in your URL bar and hit **Enter**.
3. **Enable Developer Mode**:
   - Toggle the **Developer mode** switch in the top right corner of the Extensions page.
4. **Load the Extension**:
   - Click the **"Load unpacked"** button that appears in the top left.
   - Navigate to the directory where you cloned or extracted this project.
   - Select the folder containing the `manifest.json` file.
5. **Enjoy!**
   - Open a new tab in Chrome, and you should immediately see your new professional, personalized dashboard. 🎉

## 💡 Usage Guide

- **Adding a Task**: Type into the "What needs to be done?" input on the right side of the screen and press Enter (or click the add icon). You can optionally associate it with a client by selecting one from the dropdown.
- **Managing Clients**: Click the user/client icon in the Tasks header to open the Clients Modal. From there, click the plus icon to reveal the form to add a new client (along with pricing, dates, notes, and status).
- **Social Links**: Simply click on any of the beautifully designed social tiles on the left side to navigate directly to those platforms.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
