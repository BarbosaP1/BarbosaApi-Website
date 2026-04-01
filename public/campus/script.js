// ─── CONFIG ────────────────────────────────────────────────────────────────
const SERVER_ADDRESS = '177.107.116.21:25565'; // ← troque pelo IP/domínio do seu servidor
const AUTO_REFRESH_MS = 60_000;            // atualiza a cada 60s

// ─── State ─────────────────────────────────────────────────────────────────
let autoTimer = null;

// ─── Helpers ───────────────────────────────────────────────────────────────
function timeNow() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function sanitizeMotd(str) {
    return str ? str.replace(/§[0-9a-fklmnor]/gi, '') : '';
}

function playerAvatar(name) {
    return `https://mc-heads.net/avatar/${name}/32`;
}

function setRefreshState(loading) {
    const btn  = document.getElementById('refresh-btn');
    const icon = document.getElementById('refresh-icon');
    btn.disabled = loading;
    icon.className = loading ? 'spin' : '';
}

// ─── Render ────────────────────────────────────────────────────────────────
function renderOnline(data) {
    const card = document.getElementById('status-card');
    const pct  = data.players.max > 0 ? (data.players.online / data.players.max) * 100 : 0;
    const motd = sanitizeMotd(data.motd?.clean?.[0] || data.motd?.raw?.[0] || 'Sem descrição.');

    // Swap the emoji below for <img src="your-icon.png"> once you have the file
    const iconHtml = `<div class="server-icon">🎮</div>`;

    card.className = 'status-card online reveal show';
    card.innerHTML = `
        <div class="status-header">
            <div class="server-identity">
                ${iconHtml}
                <div>
                    <div class="server-name">Campus</div>
                    <div class="server-addr">${SERVER_ADDRESS}</div>
                </div>
            </div>
            <div class="status-pill online">
                <span class="status-led"></span> ONLINE
            </div>
        </div>

        <div class="stats-row">
            <div class="stat-box">
                <div class="stat-label">Jogadores</div>
                <div class="stat-value green">${data.players.online}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Capacidade</div>
                <div class="stat-value">${data.players.max}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Versão</div>
                <div class="stat-value" style="font-size:1.1rem;padding-top:4px">${data.version || '—'}</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Ping</div>
                <div class="stat-value" style="font-size:1.3rem;padding-top:4px">
                    ${'—'}<span style="font-size:0.7rem;color:var(--text-muted)"> ms</span>
                </div>
            </div>
        </div>

        <div class="capacity-row">
            <div class="capacity-header">
                <span>Ocupação</span>
                <span>${data.players.online}/${data.players.max} (${Math.round(pct)}%)</span>
            </div>
            <div class="bar-track">
                <div class="bar-fill" id="cap-bar" style="width:0%"></div>
            </div>
        </div>

        <div class="motd-box">${motd}</div>

        <div class="chips">
            ${data.software ? `<span class="chip">🔧 ${data.software}</span>` : ''}
            ${data.plugins?.names?.slice(0, 6).map(p => `<span class="chip">${p}</span>`).join('') || ''}
            ${data.map ? `<span class="chip">🗺️ ${data.map}</span>` : ''}
        </div>
    `;

    // Animate capacity bar after paint
    requestAnimationFrame(() => {
        setTimeout(() => {
            const bar = document.getElementById('cap-bar');
            if (bar) bar.style.width = pct + '%';
        }, 80);
    });

    renderPlayers(data.players);
}

function renderOffline(err) {
    const card = document.getElementById('status-card');
    card.className = 'status-card offline reveal show';
    card.innerHTML = `
        <div class="status-header">
            <div class="server-identity">
                <div class="server-icon">🎮</div>
                <div>
                    <div class="server-name">${SERVER_ADDRESS}</div>
                    <div class="server-addr">Servidor Minecraft</div>
                </div>
            </div>
            <div class="status-pill offline">
                <span class="status-led"></span> OFFLINE
            </div>
        </div>
        <div class="error-box">
            <div class="icon">🔌</div>
            <p>${err || 'Não foi possível conectar ao servidor.'}<br>Tente novamente em alguns instantes.</p>
        </div>
    `;
    document.getElementById('players-card').style.display = 'none';
}

function renderPlayers(players) {
    const pc    = document.getElementById('players-card');
    const list  = players.list || [];
    const count = players.online || 0;

    pc.style.display = '';

    let inner = '';
    if (count === 0 || list.length === 0) {
        inner = `<div class="no-players"><div class="icon">😴</div><p>Nenhum jogador online no momento.</p></div>`;
    } else {
        inner = `<div class="players-grid">` +
            list.map(p => {
                const name = typeof p === 'string' ? p : (p.name || 'Desconhecido');
                return `
                <div class="player-item">
                    <img class="player-avatar" src="${playerAvatar(name)}" alt="${name}" onerror="this.style.display='none'">
                    <span class="player-name">${name}</span>
                </div>`;
            }).join('') +
        `</div>`;
    }

    pc.innerHTML = `
        <h2>Jogadores Online <span>(${count})</span></h2>
        ${inner}
    `;
}

// ─── Fetch ─────────────────────────────────────────────────────────────────
async function fetchStatus() {
    setRefreshState(true);

    try {
        const res  = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(SERVER_ADDRESS)}`);
        const data = await res.json();

        if (data.online) {
            renderOnline(data);
        } else {
            renderOffline('O servidor está offline ou não foi encontrado.');
        }
    } catch (e) {
        renderOffline('Erro ao consultar a API. Verifique sua conexão.');
    }

    document.getElementById('last-updated').textContent = `Última atualização: ${timeNow()}`;
    setRefreshState(false);
}

// ─── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    fetchStatus();
    autoTimer = setInterval(fetchStatus, AUTO_REFRESH_MS);
});
