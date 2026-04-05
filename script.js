const fs = {
    'root': [
        { name: 'Enhet C:', icon: '💽', target: 'c' },
        { name: 'Dokument', icon: '📂', target: 'root' }
    ],
    'c': [
        { name: 'Windows', icon: '📁', target: 'root' },
        { name: 'System', icon: '📁', target: 'root' }
    ]
};

function toggleStart() {
    document.getElementById('start-menu').classList.toggle('show');
}

function openApp(id, icon) {
    document.getElementById('win-' + id).style.display = 'flex';
    document.getElementById('start-menu').classList.remove('show');
    renderExplorer('root');
}

function closeApp(id) {
    document.getElementById('win-' + id).style.display = 'none';
}

function renderExplorer(path) {
    const view = document.getElementById('explorer-view');
    view.innerHTML = '';
    const items = fs[path] || fs['root'];
    items.forEach(item => {
        const div = document.createElement('div');
        div.style.textAlign = 'center';
        div.style.fontSize = '11px';
        div.innerHTML = `<div style="font-size:2rem;">${item.icon}</div>${item.name}`;
        view.appendChild(div);
    });
}

// Enkel klocka
setInterval(() => {
    const d = new Date();
    document.getElementById('clock').innerText = d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
}, 1000);

// Stäng startmenyn om man klickar på skrivbordet
document.getElementById('desktop').addEventListener('click', (e) => {
    if (e.target.id === 'desktop') document.getElementById('start-menu').classList.remove('show');
});
