const openApps = new Set();
const fs = {
    'root': [{ name: 'System (C:)', icon: '💽', target: 'c' }, { name: 'Dokument', icon: '📂', target: 'root' }],
    'c': [{ name: 'Windows', icon: '📁', target: 'root' }, { name: 'Users', icon: '📁', target: 'root' }, { name: 'secret.txt', icon: '📄', target: 'root' }]
};

// --- WINDOW LOGIC ---
function openApp(id, icon) {
    const win = document.getElementById('win-' + id);
    if (!openApps.has(id)) {
        win.style.display = 'flex';
        openApps.add(id);
        const pill = document.createElement('div');
        pill.className = 'app-pill active';
        pill.id = 'pill-' + id;
        pill.innerHTML = icon;
        pill.onclick = () => toggleMin(id);
        document.getElementById('active-apps').appendChild(pill);
        if (id === 'pc') renderExplorer('root');
    }
    focusWin(win);
}

function closeApp(id) {
    document.getElementById('win-' + id).style.display = 'none';
    document.getElementById('pill-' + id).remove();
    openApps.delete(id);
}

function toggleMin(id) {
    const win = document.getElementById('win-' + id);
    win.style.display = win.style.display === 'none' ? 'flex' : 'none';
    document.getElementById('pill-' + id).classList.toggle('active');
}

function focusWin(win) {
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = 100);
    win.style.zIndex = 1000;
}

// --- EXPLORER LOGIC ---
function renderExplorer(path) {
    const grid = document.getElementById('explorer-view');
    grid.innerHTML = '';
    document.getElementById('path-display').innerText = "C:\\" + (path === 'root' ? '' : path);
    (fs[path] || fs['root']).forEach(item => {
        const div = document.createElement('div');
        div.className = 'start-item';
        div.style.textAlign = 'center';
        div.onclick = () => renderExplorer(item.target);
        div.innerHTML = `<div style="font-size:2.5rem">${item.icon}</div><div style="font-size:0.7rem">${item.name}</div>`;
        grid.appendChild(div);
    });
}

// --- TERMINAL LOGIC ---
const termInput = document.getElementById('term-input');
const termOutput = document.getElementById('term-output');

termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = termInput.value.toLowerCase();
        const line = document.createElement('div');
        line.innerHTML = `C:\\> ${termInput.value}`;
        termOutput.appendChild(line);

        const response = document.createElement('div');
        if (cmd === 'dir') response.innerText = "Katalog av C:\\\n04/04/2026  12:00    <DIR>  Windows\n04/04/2026  12:00    <DIR>  Users";
        else if (cmd === 'help') response.innerText = "Tillgängliga kommandon: HELP, DIR, CLS, EXIT, NEOFETCH";
        else if (cmd === 'neofetch') response.innerText = "OS: Nanosoft NS-10\nKernel: 10.0.19044\nUptime: 2 mins\nShell: ns-sh 1.0";
        else if (cmd === 'cls') termOutput.innerHTML = '';
        else response.innerText = `'${cmd}' känns inte igen som ett internt kommando.`;
        
        termOutput.appendChild(response);
        termInput.value = '';
        document.getElementById('term-body').scrollTop = document.getElementById('term-body').scrollHeight;
    }
});

// --- DRAG LOGIC ---
document.querySelectorAll('.win-header').forEach(header => {
    header.onmousedown = (e) => {
        const win = header.parentElement;
        focusWin(win);
        let shiftX = e.clientX - win.getBoundingClientRect().left;
        let shiftY = e.clientY - win.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            win.style.left = pageX - shiftX + 'px';
            win.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(e) { moveAt(e.pageX, e.pageY); }
        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = () => document.removeEventListener('mousemove', onMouseMove);
    };
});

function toggleMenu(id) { document.getElementById(id).classList.toggle('show'); }

setInterval(() => {
    const now = new Date();
    document.getElementById('clock-time').innerText = now.toLocaleTimeString('sv-SE', {hour: '2-digit', minute:'2-digit'});
}, 1000);

