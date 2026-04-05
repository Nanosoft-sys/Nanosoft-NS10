const openApps = new Set();
let pathHistory = ['root'];

const fs = {
    'root': [
        { name: 'System (C:)', icon: '💽', target: 'c' },
        { name: 'Mina Dokument', icon: '📂', target: 'docs' }
    ],
    'c': [
        { name: 'Windows', icon: '📁', target: 'root' },
        { name: 'Users', icon: '📁', target: 'root' }
    ],
    'docs': [
        { name: 'hemligt.txt', icon: '📄', target: 'root' },
        { name: 'projekt.exe', icon: '⚙️', target: 'root' }
    ]
};

// --- WINDOWS ---
function openApp(id, icon) {
    const win = document.getElementById('win-' + id);
    win.style.display = 'flex';
    if (!openApps.has(id)) {
        openApps.add(id);
        if (id === 'pc') renderExplorer('root');
    }
}

function closeApp(id) {
    document.getElementById('win-' + id).style.display = 'none';
    openApps.delete(id);
}

// --- FILSYSTEM ---
function renderExplorer(path) {
    const view = document.getElementById('explorer-view');
    view.innerHTML = '';
    document.getElementById('path-display').innerText = "C:\\" + (path === 'root' ? '' : path);
    
    const items = fs[path] || fs['root'];
    items.forEach(item => {
        const div = document.createElement('div');
        div.style.textAlign = 'center';
        div.style.cursor = 'pointer';
        div.onclick = () => {
            pathHistory.push(item.target);
            renderExplorer(item.target);
        };
        div.innerHTML = `<div style="font-size:3rem;">${item.icon}</div><div style="font-size:0.7rem;">${item.name}</div>`;
        view.appendChild(div);
    });
}

function goBack() {
    if (pathHistory.length > 1) {
        pathHistory.pop();
        renderExplorer(pathHistory[pathHistory.length - 1]);
    }
}

// --- DRAG LOGIC (ROBUST) ---
let activeWin = null;
let startPos = { x: 0, y: 0 };

function startDrag(e, id) {
    activeWin = document.getElementById(id);
    startPos.x = e.clientX - activeWin.offsetLeft;
    startPos.y = e.clientY - activeWin.offsetTop;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function drag(e) {
    if (!activeWin) return;
    activeWin.style.left = (e.clientX - startPos.x) + 'px';
    activeWin.style.top = (e.clientY - startPos.y) + 'px';
}

function stopDrag() {
    activeWin = null;
    document.removeEventListener('mousemove', drag);
}

// --- STARTMENY ---
function toggleStart() {
    document.getElementById('start-menu').classList.toggle('show');
}

// --- CLOCK ---
setInterval(() => {
    const d = new Date();
    document.getElementById('clock-time').innerText = d.toLocaleTimeString('sv-SE', {hour: '2-digit', minute:'2-digit'});
}, 1000);
