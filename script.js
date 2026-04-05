const openApps = new Set();
let pathHistory = ['root'];

const fs = {
    'root': [
        { name: 'System (C:)', icon: '💽', target: 'c' },
        { name: 'Mina dokument', icon: '📂', target: 'root' }
    ],
    'c': [
        { name: 'Windows', icon: '📁', target: 'win' },
        { name: 'Användare', icon: '📁', target: 'root' }
    ],
    'win': [{ name: 'System32', icon: '📁', target: 'root' }]
};

function openApp(id, icon) {
    const win = document.getElementById('win-' + id);
    win.style.display = 'flex';
    document.getElementById('start-menu').classList.remove('show');
    if (!openApps.has(id)) {
        openApps.add(id);
        const pill = document.createElement('div');
        pill.className = 'app-pill';
        pill.id = 'pill-' + id;
        pill.innerHTML = icon;
        document.getElementById('active-apps').appendChild(pill);
        if (id === 'pc') renderExplorer('root');
    }
}

function closeApp(id) {
    document.getElementById('win-' + id).style.display = 'none';
    const pill = document.getElementById('pill-' + id);
    if(pill) pill.remove();
    openApps.delete(id);
}

function renderExplorer(path) {
    const view = document.getElementById('explorer-view');
    view.innerHTML = '';
    document.getElementById('path-display').value = "C:\\" + (path === 'root' ? '' : path);
    
    const items = fs[path] || fs['root'];
    items.forEach(item => {
        const div = document.createElement('div');
        div.style.textAlign = 'center';
        div.style.padding = '5px';
        div.onclick = () => {
            pathHistory.push(item.target);
            renderExplorer(item.target);
        };
        div.innerHTML = `<div style="font-size:2.5rem;">${item.icon}</div><div style="font-size:0.7rem; background:transparent;">${item.name}</div>`;
        view.appendChild(div);
    });
}

function goBack() {
    if (pathHistory.length > 1) {
        pathHistory.pop();
        renderExplorer(pathHistory[pathHistory.length - 1]);
    }
}

// DRAG LOGIC (Fast och direkt, ingen mjukhet)
let activeWin = null;
let offset = { x: 0, y: 0 };

document.querySelectorAll('.win-header').forEach(header => {
    const start = (e) => {
        activeWin = header.parentElement;
        const event = e.touches ? e.touches[0] : e;
        offset.x = event.clientX - activeWin.offsetLeft;
        offset.y = event.clientY - activeWin.offsetTop;
        document.addEventListener('mousemove', move);
        document.addEventListener('touchmove', move, { passive: false });
    };
    header.addEventListener('mousedown', start);
    header.addEventListener('touchstart', start);
});

function move(e) {
    if (!activeWin) return;
    if (e.type === 'touchmove') e.preventDefault();
    const event = e.touches ? e.touches[0] : e;
    
    let x = event.clientX - offset.x;
    let y = event.clientY - offset.y;

    // Lås fönstret inom skärmen
    x = Math.max(0, Math.min(x, window.innerWidth - activeWin.offsetWidth));
    y = Math.max(0, Math.min(y, window.innerHeight - 35));

    activeWin.style.left = x + 'px';
    activeWin.style.top = y + 'px';
}

document.addEventListener('mouseup', () => activeWin = null);
document.addEventListener('touchend', () => activeWin = null);

function toggleMin(id) {
    const win = document.getElementById('win-' + id);
    win.style.display = win.style.display === 'none' ? 'flex' : 'none';
}

function toggleStart() {
    document.getElementById('start-menu').classList.toggle('show');
}

// Stäng startmeny vid klick utanför
document.addEventListener('click', (e) => {
    if(!e.target.closest('#start-btn') && !e.target.closest('#start-menu')) {
        document.getElementById('start-menu').classList.remove('show');
    }
});

setInterval(() => {
    const d = new Date();
    document.getElementById('clock-time').innerText = d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
}, 1000);
