// app.js — Newood Door Order sheet
// Items grouped by type; Door rows have Style+MDF, all others have W/H/Q/Notes only.

import { DOOR_CATALOG, getDoorById } from '../doorCatalog.js';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLkJmOjRyYX9BPc2QETBTuLILE1GyKPiYBalsxMQnKJHS9DDhOpRUcLH-svBg5Bo3D/exec';
const TO_EMAIL   = 'info@newoodmillwork.com';

const TYPE_ORDER = ['Door', 'Drawer'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function pad2(n) { return String(n).padStart(2, '0'); }

function makePo() {
  const t = new Date();
  return `${String(t.getFullYear()).slice(-2)}${pad2(t.getMonth()+1)}${pad2(t.getDate())}-${pad2(t.getHours())}${pad2(t.getMinutes())}`;
}

function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')[+m-1]} ${+d}, ${y}`;
}

let _seq = 0;
function uid() { return `i${Date.now().toString(36)}${++_seq}`; }

function newItem(type, src = {}) {
  return {
    id:          uid(),
    itemType:    type,
    doorStyleId: src.doorStyleId ?? null,
    width:       src.width       ?? '',
    height:      src.height      ?? '',
    quantity:    src.quantity    ?? 1,
    notes:       src.notes       ?? '',
  };
}

// ── Order state ───────────────────────────────────────────────────────────────

const order = {
  poNumber:    makePo(),
  date:        todayISO(),
  nameCompany: '',
  email:       '',
  phone:       '',
  orderNotes:  '',
  items:       [newItem('Door')],
};

// ── Calculations ──────────────────────────────────────────────────────────────

function sqft(item) {
  const w = parseFloat(item.width)  || 0;
  const h = parseFloat(item.height) || 0;
  const q = Math.max(0, Math.floor(parseFloat(item.quantity) || 0));
  return (w * h * q) / 144;
}

function calcTotalQty() {
  return order.items.reduce((s, it) => s + Math.max(0, Math.floor(parseFloat(it.quantity) || 0)), 0);
}

function calcTotalSqft() {
  return order.items.reduce((s, it) => s + sqft(it), 0);
}

// ── DOM refs ──────────────────────────────────────────────────────────────────

const poDisplay      = document.getElementById('poDisplay');
const dateDisplay    = document.getElementById('dateDisplay');
const nameInp        = document.getElementById('nameInput');
const emailInp       = document.getElementById('emailInput');
const phoneInp       = document.getElementById('phoneInput');
const orderNotesInp  = document.getElementById('orderNotesInput');
const orderBody     = document.getElementById('orderBody');
const totalQtyEl    = document.getElementById('totalQty');
const totalSqftEl   = document.getElementById('totalSqft');
const addItemBtn    = document.getElementById('addItemBtn');
const addMenu       = document.getElementById('addMenu');
const downloadBtn   = document.getElementById('downloadCsvBtn');
const sendBtn       = document.getElementById('sendBtn');
const closeBtn      = document.getElementById('closeBtn');
const dpOverlay     = document.getElementById('doorPicker');
const dpGrid        = document.getElementById('dpGrid');
const dpClose       = document.getElementById('dpClose');
const dpTabBtns     = document.querySelectorAll('.dp-tab');

// ── Render ────────────────────────────────────────────────────────────────────

function render(focusId) {
  orderBody.innerHTML = '';

  TYPE_ORDER.forEach(type => {
    const items = order.items.filter(it => it.itemType === type);
    if (!items.length) return;

    const section = document.createElement('section');
    section.className = 'og';

    const head = document.createElement('div');
    head.className   = 'og-head';
    head.textContent = type.toUpperCase();
    section.appendChild(head);

    const wrap = document.createElement('div');
    wrap.className = 'do-table-wrap';

    const table   = document.createElement('table');
    table.className = 'ot';

    const thead   = document.createElement('thead');
    const headRow = document.createElement('tr');
    if (type === 'Door') {
      headRow.innerHTML = `
        <th class="ot-col-style">Style</th>
        <th class="ot-col-mat">Material</th>
        <th class="ot-col-dim">W″</th>
        <th class="ot-col-dim">H″</th>
        <th class="ot-col-qty">Q</th>
        <th class="ot-col-notes">Notes</th>
        <th class="ot-col-sqft">Sq.Ft.</th>
        <th class="ot-col-act"></th>`;
    } else {
      headRow.innerHTML = `
        <th class="ot-col-dim">W″</th>
        <th class="ot-col-dim">H″</th>
        <th class="ot-col-qty">Q</th>
        <th class="ot-col-notes">Notes</th>
        <th class="ot-col-sqft">Sq.Ft.</th>
        <th class="ot-col-act"></th>`;
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    items.forEach(item => tbody.appendChild(renderRow(item, type === 'Door')));
    table.appendChild(tbody);

    wrap.appendChild(table);
    section.appendChild(wrap);
    orderBody.appendChild(section);
  });

  updateTotals();

  if (focusId) {
    requestAnimationFrame(() => document.getElementById(focusId)?.focus());
  }
}

function renderRow(item, isDoor) {
  const tr = document.createElement('tr');
  tr.className  = 'ot-row';
  tr.dataset.id = item.id;

  if (isDoor) {
    const tdStyle = document.createElement('td');
    tdStyle.className = 'ot-td ot-td-style';
    tdStyle.appendChild(makeStyleBtn(item));
    tr.appendChild(tdStyle);
    tr._styleCell = tdStyle;

    const tdMat = document.createElement('td');
    tdMat.className = 'ot-td';
    const mdf = document.createElement('span');
    mdf.className   = 'ot-mdf';
    mdf.textContent = 'MDF';
    tdMat.appendChild(mdf);
    tr.appendChild(tdMat);
  }

  // W
  const tdW  = document.createElement('td');
  tdW.className = 'ot-td';
  const wInp = makeNumInp(item.width, v => { item.width = v; refreshSqft(tr, item); });
  wInp.id = `w_${item.id}`;
  tdW.appendChild(wInp);
  tr.appendChild(tdW);

  // H
  const tdH  = document.createElement('td');
  tdH.className = 'ot-td';
  const hInp = makeNumInp(item.height, v => { item.height = v; refreshSqft(tr, item); });
  hInp.id = `h_${item.id}`;
  tdH.appendChild(hInp);
  tr.appendChild(tdH);

  // Q
  const tdQ  = document.createElement('td');
  tdQ.className = 'ot-td';
  const qInp = makeNumInp(item.quantity, v => { item.quantity = v; refreshSqft(tr, item); }, true);
  qInp.id = `q_${item.id}`;
  tdQ.appendChild(qInp);
  tr.appendChild(tdQ);

  // Notes
  const tdNotes = document.createElement('td');
  tdNotes.className = 'ot-td';
  const notesEl = document.createElement('textarea');
  notesEl.className   = 'ot-notes';
  notesEl.value       = item.notes;
  notesEl.placeholder = 'Notes';
  notesEl.id = `notes_${item.id}`;
  notesEl.addEventListener('input', e => { item.notes = e.target.value; });
  tdNotes.appendChild(notesEl);
  tr.appendChild(tdNotes);

  // Sq.Ft.
  const tdSqft = document.createElement('td');
  tdSqft.className = 'ot-td ot-td-sqft';
  const sqftSpan = document.createElement('span');
  sqftSpan.className   = 'ot-sqft';
  sqftSpan.textContent = sqft(item).toFixed(2);
  tdSqft.appendChild(sqftSpan);
  tr._sqftSpan = sqftSpan;
  tr.appendChild(tdSqft);

  // Actions
  const tdAct = document.createElement('td');
  tdAct.className = 'ot-td ot-td-act';

  const dupBtn = document.createElement('button');
  dupBtn.type      = 'button';
  dupBtn.className = 'ot-act ot-dup';
  dupBtn.title     = 'Duplicate';
  dupBtn.textContent = '⧉';
  dupBtn.addEventListener('click', () => {
    const copy = newItem(item.itemType, { ...item });
    order.items.splice(order.items.indexOf(item) + 1, 0, copy);
    render(`w_${copy.id}`);
  });

  const delBtn = document.createElement('button');
  delBtn.type      = 'button';
  delBtn.className = 'ot-act ot-del';
  delBtn.title     = 'Delete';
  delBtn.textContent = '×';
  delBtn.addEventListener('click', () => {
    order.items = order.items.filter(it => it.id !== item.id);
    render();
  });

  tdAct.append(dupBtn, delBtn);
  tr.appendChild(tdAct);

  return tr;
}

function makeNumInp(value, onChange, isQty = false) {
  const el = document.createElement('input');
  el.type        = 'number';
  el.className   = 'ot-cell ot-cell-dim';
  el.value       = value !== '' ? value : '';
  el.placeholder = isQty ? '1' : '0';
  el.min         = isQty ? '1' : '0';
  el.step        = isQty ? '1' : 'any';
  el.addEventListener('input', e => { onChange(e.target.value); updateTotals(); });
  return el;
}

function makeStyleBtn(item) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id   = `style_${item.id}`;

  if (item.doorStyleId) {
    const door = getDoorById(item.doorStyleId);
    if (door) {
      btn.className = 'ot-style-btn';
      const img = document.createElement('img');
      img.src       = door.image;
      img.alt       = '';
      img.className = 'ot-thumb';
      const label = document.createElement('span');
      label.className   = 'ot-style-label';
      label.textContent = door.name;
      const caret = document.createElement('span');
      caret.className   = 'ot-caret';
      caret.textContent = '▾';
      btn.append(img, label, caret);
      btn.addEventListener('click', () => openPicker(item));
      return btn;
    }
  }

  btn.className   = 'ot-style-btn ot-style-empty';
  btn.textContent = 'Pick Style ▾';
  btn.addEventListener('click', () => openPicker(item));
  return btn;
}

function refreshSqft(tr, item) {
  if (tr._sqftSpan) tr._sqftSpan.textContent = sqft(item).toFixed(2);
}

function updateTotals() {
  totalQtyEl.textContent  = calcTotalQty();
  totalSqftEl.textContent = calcTotalSqft().toFixed(2);
}

// ── Add Item dropdown ─────────────────────────────────────────────────────────

addItemBtn.addEventListener('click', e => {
  e.stopPropagation();
  addMenu.hidden = !addMenu.hidden;
});

addMenu.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', () => {
    const type = li.dataset.type;
    addMenu.hidden = true;
    const item = newItem(type);
    order.items.push(item);
    render(type === 'Door' ? `style_${item.id}` : `w_${item.id}`);
  });
});

document.addEventListener('click', () => { addMenu.hidden = true; });

// ── Door Picker ───────────────────────────────────────────────────────────────

let _pickerItem    = null;
let _pickerCat     = 'flat-panel';
let _pickerSel     = new Set();  // doorStyleIds selected this picker session
let _pickerMap     = new Map();  // doorStyleId → item object
let _pickerNextIdx = 0;          // splice position for next new row

function openPicker(item) {
  _pickerItem    = item;
  _pickerSel     = new Set();
  _pickerMap     = new Map();
  _pickerNextIdx = order.items.indexOf(item);
  if (item.doorStyleId) {
    _pickerSel.add(item.doorStyleId);
    _pickerMap.set(item.doorStyleId, item);
  }
  renderPickerGrid();
  dpOverlay.hidden = false;
  document.body.classList.add('dp-lock');
}

function closePicker() {
  dpOverlay.hidden = true;
  document.body.classList.remove('dp-lock');
}

function renderPickerGrid() {
  dpGrid.innerHTML = '';
  DOOR_CATALOG.filter(d => d.category === _pickerCat).forEach(door => {
    const sel  = _pickerSel.has(door.id);
    const card = document.createElement('button');
    card.type      = 'button';
    card.className = 'dp-card' + (sel ? ' selected' : '');

    const media = document.createElement('div');
    media.className = 'dp-media';

    const img = document.createElement('img');
    img.src     = door.image;
    img.alt     = door.alt;
    img.loading = 'lazy';
    media.appendChild(img);

    if (sel) {
      const chk = document.createElement('span');
      chk.className   = 'dp-check';
      chk.textContent = '✓';
      media.appendChild(chk);
    }

    const lbl = document.createElement('span');
    lbl.className   = 'dp-label';
    lbl.textContent = door.name;

    card.append(media, lbl);
    card.addEventListener('click', () => selectDoor(door));
    dpGrid.appendChild(card);
  });
}

function selectDoor(door) {
  if (!_pickerItem) return;

  if (_pickerSel.has(door.id)) {
    // Deselect — remove the corresponding row
    _pickerSel.delete(door.id);
    const it = _pickerMap.get(door.id);
    _pickerMap.delete(door.id);
    if (it === _pickerItem) {
      _pickerItem.doorStyleId = null;
    } else {
      const idx = order.items.indexOf(it);
      if (idx !== -1 && idx <= _pickerNextIdx) _pickerNextIdx--;
      order.items = order.items.filter(x => x !== it);
    }
  } else {
    // Select — fill anchor row or insert a new one
    _pickerSel.add(door.id);
    if (!_pickerItem.doorStyleId) {
      _pickerItem.doorStyleId = door.id;
      _pickerMap.set(door.id, _pickerItem);
      _pickerNextIdx = order.items.indexOf(_pickerItem);
    } else {
      const added = newItem('Door', { doorStyleId: door.id });
      _pickerNextIdx++;
      order.items.splice(_pickerNextIdx, 0, added);
      _pickerMap.set(door.id, added);
    }
  }

  render();
  renderPickerGrid();
}

dpClose.addEventListener('click', closePicker);
dpOverlay.addEventListener('pointerdown', e => { if (e.target === dpOverlay) closePicker(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !dpOverlay.hidden) closePicker(); });
dpTabBtns.forEach(btn => btn.addEventListener('click', () => {
  dpTabBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _pickerCat = btn.dataset.cat;
  renderPickerGrid();
}));

// ── Close button ──────────────────────────────────────────────────────────────

closeBtn.addEventListener('click', () => {
  if (hasOrderData() && !confirm('Your order data will be lost. Close anyway?')) return;
  if (window.parent !== window) {
    if (typeof window.parent.closeOrderPopup === 'function') {
      window.parent.closeOrderPopup();
    } else {
      window.parent.postMessage({ type: 'closeOk' }, '*');
    }
  } else {
    window.location.href = 'doors.html';
  }
});

// ── CSV ───────────────────────────────────────────────────────────────────────

function csvQ(v) {
  const s = String(v ?? '');
  return /[,"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function buildCsv() {
  const headers = [
    'PO Number', 'Date', 'Customer', 'Email', 'Phone',
    'Item Type', 'Door Collection', 'Door Style', 'Style ID', 'Material',
    'Width (in)', 'Height (in)', 'Quantity', 'Notes', 'Sq.Ft.',
  ];
  const rows = [headers.map(csvQ).join(',')];
  order.items.forEach(item => {
    const door = item.doorStyleId ? getDoorById(item.doorStyleId) : null;
    rows.push([
      order.poNumber, order.date, order.nameCompany, order.email, order.phone,
      item.itemType,
      door?.collectionName ?? '',
      door?.name ?? '',
      door?.id ?? '',
      item.itemType === 'Door' ? 'MDF' : '',
      item.width, item.height, item.quantity, item.notes,
      sqft(item).toFixed(2),
    ].map(csvQ).join(','));
  });
  return rows.join('\r\n');
}

downloadBtn.addEventListener('click', () => {
  const blob = new Blob([buildCsv()], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `Newood-Order-${order.poNumber}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// ── Send to Newood ────────────────────────────────────────────────────────────

let _sendNoticeTimer = null;

function showSendResult(msg, isError) {
  let el = document.getElementById('sendNotice');
  if (!el) {
    el = document.createElement('p');
    el.id        = 'sendNotice';
    el.className = 'do-send-notice';
    document.querySelector('.do-actions').after(el);
  }
  el.textContent = msg;
  el.className   = 'do-send-notice' + (isError ? ' do-send-notice-err' : '');
  el.hidden      = false;
  clearTimeout(_sendNoticeTimer);
  _sendNoticeTimer = setTimeout(() => { el.hidden = true; }, isError ? 12000 : 6000);
}

function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary  = '';
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function sendEmailWithCsv() {
  if (!SCRIPT_URL || SCRIPT_URL === 'PASTE_APPS_SCRIPT_URL_HERE') {
    throw new Error('Apps Script URL not configured.');
  }

  const subject  = `Door Order – ${order.poNumber}${order.nameCompany ? ' – ' + order.nameCompany : ''}`;
  const filename = `Newood-Order-${order.poNumber}.csv`;

  const itemLines = order.items.map((item, i) => {
    const door  = item.doorStyleId ? getDoorById(item.doorStyleId) : null;
    const lines = [`${i + 1}. ${item.itemType}`];
    if (item.itemType === 'Door') {
      lines.push(`   Door Style: ${door ? door.name : '—'}`);
      lines.push(`   Material: MDF`);
    }
    lines.push(`   Size: ${item.width || '?'}" × ${item.height || '?'}"`);
    lines.push(`   Qty: ${item.quantity || '?'}`);
    if (item.notes) lines.push(`   Notes: ${item.notes}`);
    return lines.join('\n');
  }).join('\n\n');

  const subitems = order.items.map(item => {
    const door = item.doorStyleId ? getDoorById(item.doorStyleId) : null;
    return {
      itemType: item.itemType,
      style:    door ? door.name : '',
      material: item.itemType === 'Door' ? 'MDF' : '',
      width:    item.width,
      height:   item.height,
      quantity: item.quantity,
      notes:    item.notes,
      sqft:     sqft(item).toFixed(2),
    };
  });

  const body = [
    'A new order has been submitted through the Newood Millwork website.',
    '',
    'Order Details',
    '',
    `PO #: ${order.poNumber}`,
    `Date: ${fmtDate(order.date)}`,
    `Customer: ${order.nameCompany || '—'}`,
    `Email: ${order.email || '—'}`,
    `Phone: ${order.phone || '—'}`,
    '',
    'Order Summary',
    '',
    `Total Items: ${order.items.length}`,
    `Total Quantity: ${calcTotalQty()}`,
    `Total Sq.Ft.: ${calcTotalSqft().toFixed(2)}`,
    '',
    'Order Items:',
    '',
    itemLines,
    '',
    'Customer Notes:',
    order.orderNotes || '—',
    '',
    'The complete order CSV is attached to this email.',
    '',
    'Please review the order details before processing.',
  ].join('\n');

  const payload = JSON.stringify({
    to: TO_EMAIL,
    cc: order.email || '',
    subject,
    body,
    csv:      toBase64(buildCsv()),
    filename,
    monday: {
      poNumber:   order.poNumber,
      customer:   order.nameCompany || '',
      email:      order.email || '',
      phone:      order.phone || '',
      date:       order.date,
      totalItems: order.items.length,
      totalQty:   calcTotalQty(),
      totalSqft:  calcTotalSqft().toFixed(2),
      details:    itemLines,
      orderNotes: order.orderNotes || '',
      items:      subitems,
    },
  });

  await sendViaFormIframe(payload);
}

function sendViaFormIframe(jsonPayload) {
  return new Promise((resolve, reject) => {
    const frameName = '_gasf_' + Date.now();
    const frame = document.createElement('iframe');
    frame.name = frameName;
    frame.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden;';
    document.body.appendChild(frame);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = SCRIPT_URL;
    form.target = frameName;
    form.style.cssText = 'display:none;';

    const field = document.createElement('input');
    field.type  = 'hidden';
    field.name  = 'json';
    field.value = jsonPayload;
    form.appendChild(field);
    document.body.appendChild(form);

    let done = false, submitted = false;
    function finish(ok, err) {
      if (done) return;
      done = true;
      setTimeout(() => { frame.remove(); form.remove(); }, 0);
      ok ? resolve() : reject(err);
    }

    frame.addEventListener('load', () => { if (submitted) finish(true); });
    frame.addEventListener('error', () => finish(false, new Error('Network error')));
    setTimeout(() => finish(true), 15000);
    form.submit();
    submitted = true;
  });
}

sendBtn.addEventListener('click', async () => {
  if (!(order.nameCompany || '').trim()) {
    showSendResult('Please enter your name or company.', true);
    nameInp?.focus();
    return;
  }
  if (!(order.email || '').trim()) {
    showSendResult('Please enter your email address.', true);
    emailInp?.focus();
    return;
  }
  if (!(order.phone || '').trim()) {
    showSendResult('Please enter your phone number.', true);
    phoneInp?.focus();
    return;
  }
  if (!order.items.length) {
    showSendResult('Please add at least one item.', true);
    addItemBtn?.focus();
    return;
  }
  for (const item of order.items) {
    if (!String(item.width || '').trim() || !String(item.height || '').trim()) {
      showSendResult('Please enter a Width and Height for every item.', true);
      document.getElementById(`${item.width ? 'h' : 'w'}_${item.id}`)?.focus();
      return;
    }
  }

  const origText      = sendBtn.textContent;
  sendBtn.disabled    = true;
  sendBtn.textContent = 'Sending…';
  try {
    await sendEmailWithCsv();
    sendBtn.textContent = 'Sent ✓';
    showSendResult('Email sent — CSV attached.', false);
    setTimeout(() => { sendBtn.textContent = origText; sendBtn.disabled = false; }, 3000);
  } catch (err) {
    sendBtn.textContent = origText;
    sendBtn.disabled    = false;
    showSendResult(`Send failed: ${err.message}`, true);
  }
});

// ── Popup close handshake ─────────────────────────────────────────────────────

function hasOrderData() {
  if ((order.nameCompany || '').trim()) return true;
  if ((order.email || '').trim()) return true;
  if ((order.phone || '').trim()) return true;
  if ((order.orderNotes || '').trim()) return true;
  return order.items.some(it =>
    it.doorStyleId || it.notes ||
    (it.width !== '' && it.width != null) ||
    (it.height !== '' && it.height != null)
  );
}

window.addEventListener('message', e => {
  if (!e.data || e.data.type !== 'requestClose') return;
  if (!hasOrderData() || confirm('Your order data will be lost. Close anyway?')) {
    window.parent.postMessage({ type: 'closeOk' }, '*');
  }
});

// ── Boot ──────────────────────────────────────────────────────────────────────

poDisplay.textContent   = order.poNumber;
dateDisplay.textContent = fmtDate(order.date);
nameInp?.addEventListener('input',       e => { order.nameCompany = e.target.value; });
emailInp?.addEventListener('input',      e => { order.email       = e.target.value; });
phoneInp?.addEventListener('input',      e => { order.phone       = e.target.value; });
orderNotesInp?.addEventListener('input', e => { order.orderNotes  = e.target.value; });

render();
