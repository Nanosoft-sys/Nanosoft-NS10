const openApps = new Set();
let pathHistory = ['root'];

const fs = {
    'root': [
        { name: 'System (C:)', icon: '💽', target: 'c' },
        { name: 'Floppy (A:)', icon: '💾', target: 'root' },
        { name: 'Mina Bilder', icon: '🖼️', target: 'docs' }
    ],
    'c': [
        { name: 'Windows', icon: '📁', target: 'win' },
        { name: 'Användare', icon: '📁', target: 'users' },
        { name: 'hemligt.txt', icon: '📄', target: 'file' }
    ],
    'docs': [
        { name: 'projekt.exe', icon: '🎮', target: 'root' },
        { name: 'log.log', icon: '📄', target: 'root' }
    ],
    'win': [{ name: 'System32', icon: '📁', target: 'root' }],
    'users': [{ name: 'Användare', icon: '👤', target: 'root' }],
    'file': [] // Tomma mappar
};

// --- WINDOW LOGIC ---
function openApp(id, icon) {
    const win = document.getElementById('win-' + id);
    const menus = document.querySelectorAll('.popup-menu, #start-menu');
    menus.forEach(m => m.classList.remove('show')); // Stäng menyer

    if (!openApps.has(id)) {
        win.style.display = 'flex';
        openApps.add(id);
        
        const container = document.getElementById('active-apps');
        const pill = document.createElement('div');
        pill.className = 'app-pill active';
        pill.id = 'pill-' + id;
        pill.innerHTML = `<span>${icon}</span>`;
        pill.onclick = () => toggleMin(id);
        container.appendChild(pill);
        
        if (id === 'pc') renderExplorer('root');
    }
    bringToFront(win);
}

function closeApp(id) {
    document.getElementById('win-' + id).style.display = 'none';
    const pill = document.getElementById('pill-' + id);
    if(pill) pill.remove();
    openApps.delete(id);
}

function toggleMin(id) {
    const win = document.getElementById('win-' + id);
    const pill = document.getElementById('pill-' + id);
    if (win.style.display === 'none') {
        win.style.display = 'flex';
        pill.classList.add('active');
        bringToFront(win);
    } else {
        win.style.display = 'none';
        pill.classList.remove('active');
    }
}

function bringToFront(win) {
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = 100);
    win.style.zIndex = 1000;
}

// --- EXPLORER LOGIC (Bug Fixad) ---
function renderExplorer(path) {
    const view = document.getElementById('explorer-view');
    view.innerHTML = '';
    document.getElementById('path-display').innerText = "Nanosoft: " + path.toUpperCase();
    
    const items = fs[path] || fs['root'];
    
    if (items.length === 0) {
        view.innerHTML = '<div style="font-size:0.7rem; color:#555; text-align:center; grid-column: span 3; padding: 20px;">Mappen är tom.</div>';
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'start-item'; // Använd startmeny-design för klick-känsla
        div.style.textAlign = 'center';
        div.style.cursor = 'pointer';
        div.style.padding = '10px';
        div.style.borderRadius = '8px';

        div.onclick = (e) => {
            e.stopPropagation();
            if (fs[item.target]) {
                pathHistory.push(item.target);
                renderExplorer(item.target);
            } else {
                alert('Öppnar: ' + item.name);
            }
        };
        div.innerHTML = `<div style="font-size:2.5rem; margin-bottom:5px;">${item.icon}</div><div style="font-size:0.7rem;">${item.name}</div>`;
        view.appendChild(div);
    });
}

function goBack() {
    if (pathHistory.length > 1) {
        pathHistory.pop(); // Ta bort nuvarande path
        renderExplorer(pathHistory[pathHistory.length - 1]); // Ladda förra
    }
}

// --- DRAG LOGIC (Stenhård Fix för Både Mus och Touch) ---
let activeDraggingWin = null;
let offset = { x: 0, y: 0 };

document.querySelectorAll('.win-header').forEach(header => {
    // Mus
    header.addEventListener('mousedown', dragStart);
    // Touch
    header.addEventListener('touchstart', dragStart, { passive: false });
});

function dragStart(e) {
    if (e.target.closest('.win-controls')) return; // Klicka inte på knappar
    activeDraggingWin = e.currentTarget.parentElement;
    bringToFront(activeDraggingWin);

    const pos = getPos(e);
    const rect = activeDraggingWin.getBoundingClientRect();
    
    offset.x = pos.x - rect.left;
    offset.y = pos.y - rect.top;

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('touchmove', dragMove, { passive: false });
    document.addEventListener('mouseup', dragStop);
    document.addEventListener('touchend', dragStop);
}

function dragMove(e) {
    if (!activeDraggingWin) return;
    if (e.type === 'touchmove') e.preventDefault(); // Hindra mobilskroll
    
    const pos = getPos(e);
    activeDraggingWin.style.left = (pos.x - offset.x) + 'px';
    activeDraggingWin.style.top = (pos.y - offset.y) + 'px';
}

function dragStop() {
    activeDraggingWin = null;
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('touchmove', dragMove);
    document.removeEventListener('mouseup', dragStop);
    document.removeEventListener('touchend', dragStop);
}

function getPos(e) {
    if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
}

// --- MENUS ---
function toggleStart() {
    document.getElementById('start-menu').classList.toggle('show');
}

// Stäng startmenyn vid klick utanför
document.getElementById('desktop').onclick = (e) => {
    if(e.target.id === 'desktop') {
        document.querySelectorAll('.win10-menu').forEach(m => m.classList.remove('show'));
    }
}

// --- CLOCK ---
setInterval(() => {
    const d = new Date();
    const time = d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
    const date = d.getFullYear() + "-" + (d.getMonth() + 1).toString().padStart(2, '0') + "-" + d.getDate().toString().padStart(2, '0');
    document.getElementById('clock-time').innerText = time;
    document.getElementById('clock-date').innerText = date;
}, 1000);
