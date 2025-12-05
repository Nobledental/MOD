const deviceRows = document.querySelectorAll('#device_status_rows tr');
const statusStates = [
  { status: 'Connected', signal: 'Strong', eta: 'Just now' },
  { status: 'Ready', signal: 'Moderate', eta: '2 min ago' },
  { status: 'Standby', signal: 'Idle', eta: '—' },
  { status: 'Syncing', signal: 'Strong', eta: 'Syncing' },
];

function randomState() {
  return statusStates[Math.floor(Math.random() * statusStates.length)];
}

function refreshDeviceStatuses() {
  deviceRows.forEach(row => {
    const state = randomState();
    const [statusCell, signalCell, etaCell] = [
      row.children[1],
      row.children[2],
      row.children[3],
    ];
    if (!statusCell || !signalCell || !etaCell) return;

    const statusBadge = statusCell.querySelector('.chip');
    const signalBadge = signalCell.querySelector('.chip');

    if (statusBadge) statusBadge.textContent = state.status;
    if (signalBadge) signalBadge.textContent = state.signal;
    etaCell.textContent = state.eta;
  });
}

if (deviceRows.length) {
  refreshDeviceStatuses();
  setInterval(refreshDeviceStatuses, 8000);
}

const familyCards = document.querySelectorAll('#family_tiles .stat');
if (familyCards.length) {
  familyCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('pulse');
      const hint = card.querySelector('.hint');
      if (hint) {
        hint.textContent = hint.textContent.includes('Live')
          ? 'Sharing paused'
          : 'Live alerts mirrored';
      }
    });
  });
}
