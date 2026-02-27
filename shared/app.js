/* K▶T — KDrama TOPIK App Logic */

// ── Theme ──
function toggleTheme() {
  var h = document.documentElement;
  var curr = h.getAttribute('data-theme') || 'dark';
  var next = curr === 'dark' ? 'light' : 'dark';
  h.setAttribute('data-theme', next);
  try { localStorage.setItem('kt-theme', next); } catch (e) {}
}
(function () {
  try {
    var t = localStorage.getItem('kt-theme');
    if (t) document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();

// ── View navigation ──
function go(id) {
  ['v-home', 'v-dash', 'v-drama', 'v-ep'].forEach(function (v) {
    var el = document.getElementById(v);
    if (el) el.classList.add('hidden');
  });
  var target = document.getElementById(id);
  if (target) target.classList.remove('hidden');
  window.scrollTo({ top: 0 });
  if (id === 'v-drama') {
    try { localStorage.setItem('kt-visited', '1'); } catch (e) {}
  }
}

// ── Bottom sheets ──
var pendingClipId = '';

function openSheet(t) {
  document.getElementById('o-' + t).classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeSheet(t) {
  document.getElementById('o-' + t).classList.remove('show');
  document.body.style.overflow = '';
}

function showUnlock(id) {
  pendingClipId = id;
  document.getElementById('m-cid').textContent = id;
  openSheet('unlock');
}

function doAd() {
  closeSheet('unlock');
  alert('🎬 ' + pendingClipId + ' 24h 해제!');
}

// ── YouTube thumbnail helper ──
function ytThumb(vid) {
  return 'https://img.youtube.com/vi/' + vid + '/mqdefault.jpg';
}

// ── localStorage helpers ──
function getProgress() {
  try {
    return JSON.parse(localStorage.getItem('kt-progress') || '{}');
  } catch (e) { return {}; }
}

function getStats() {
  var progress = getProgress();
  var clips = Object.keys(progress).length;
  var quiz = 0;
  Object.keys(progress).forEach(function (k) {
    quiz += progress[k].quiz || 0;
  });
  var streak = 0;
  try { streak = parseInt(localStorage.getItem('kt-streak') || '0'); } catch (e) {}
  return { clips: clips, quiz: quiz, streak: streak };
}

// ── Data loading ──
var episodesData = null;

function loadEpisodesData() {
  return fetch('data/cloy/episodes.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      episodesData = data;
      return data;
    });
}

// ── Render episode grid ──
function renderEpGrid() {
  var g = document.getElementById('epg');
  if (!g || !episodesData) return;
  g.innerHTML = '';
  episodesData.episodes.forEach(function (ep) {
    var d = document.createElement('div');
    var isFree = ep.free;
    d.className = 'ep' + (isFree ? ' free' : '');
    d.innerHTML = '<div class="n">' + ep.ep + '화</div><div class="c">' + ep.clips.length + '클립</div>' +
      (isFree ? '<span class="fb">FREE</span>' : '<span class="lk">🔒</span>');
    d.onclick = function () { showEp(ep); };
    g.appendChild(d);
  });
}

// ── Show episode clips ──
function showEp(ep) {
  var p = ep.ep < 10 ? '0' + ep.ep : '' + ep.ep;
  var isFree = ep.free;
  document.getElementById('ept').innerHTML = 'EP' + p + ' · ' + ep.clips.length + ' CLIPS ' +
    (isFree ? '<span style="color:var(--teal)">FREE</span>' : '<span style="color:var(--purple)">PREMIUM</span>');

  var h = '';
  ep.clips.forEach(function (clip) {
    var vid = clip.vid;
    var thumb = vid ? ytThumb(vid) : '';
    var hasSrt = ep.ep <= 2;
    var title = clip.title || clip.id;

    if (isFree) {
      h += '<div class="clip" onclick="goClip(\'' + clip.id + '\')">' +
        '<div class="clip-th"><img src="' + thumb + '" loading="lazy"></div>' +
        '<div class="ci"><div class="cid">' + clip.id +
        (hasSrt ? ' <span class="srt">SRT</span>' : '') +
        '</div><div class="cd">' + escHtml(title) + '</div></div></div>';
    } else {
      h += '<div class="clip" onclick="showUnlock(\'' + clip.id + '\')">' +
        '<div class="clip-th"><img src="' + thumb + '" loading="lazy"><div class="ol">🔒</div></div>' +
        '<div class="ci"><div class="cid">' + clip.id +
        '</div><div class="cd">' + escHtml(title) + '</div>' +
        '<div class="hint">🔒 AD or PRO</div></div></div>';
    }
  });

  document.getElementById('clist').innerHTML = h;
  go('v-ep');
}

// ── Navigate to learn page ──
function goClip(clipId) {
  window.location.href = 'learn.html?clip=' + clipId;
}

// ── HTML escape ──
function escHtml(s) {
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ── Dashboard rendering ──
function renderDashboard() {
  var stats = getStats();
  var el;

  el = document.getElementById('dash-clips');
  if (el) el.textContent = stats.clips;
  el = document.getElementById('dash-quiz');
  if (el) el.textContent = stats.quiz;
  el = document.getElementById('dash-streak');
  if (el) el.textContent = stats.streak;

  // Resume card
  var lastClip = null;
  try { lastClip = localStorage.getItem('kt-last-clip'); } catch (e) {}
  if (lastClip && episodesData) {
    var found = findClipById(lastClip);
    if (found) {
      var thumbEl = document.querySelector('.resume-thumb img');
      if (thumbEl && found.vid) thumbEl.src = ytThumb(found.vid);
      var titleEl = document.getElementById('dash-resume-title');
      if (titleEl) titleEl.textContent = found.id;
      var subEl = document.querySelector('.resume-sub');
      if (subEl) subEl.textContent = '사랑의 불시착 · ' + found.ep + '화';

      var resumeCard = document.querySelector('.resume-card');
      if (resumeCard) {
        resumeCard.onclick = function () { goClip(found.id); };
      }
    }
  }

  // Drama progress
  var completedClips = stats.clips;
  var totalClips = episodesData ? episodesData.total_clips : 249;
  var pct = totalClips > 0 ? Math.round((completedClips / totalClips) * 100) : 0;

  var dashBarF = document.querySelector('.dash-bar-f');
  if (dashBarF) dashBarF.style.width = pct + '%';
  var dashSub = document.querySelector('.dash-dinfo .sub');
  if (dashSub) dashSub.textContent = completedClips + '/' + totalClips + ' 클립 완료';
}

function findClipById(clipId) {
  if (!episodesData) return null;
  for (var i = 0; i < episodesData.episodes.length; i++) {
    var ep = episodesData.episodes[i];
    for (var j = 0; j < ep.clips.length; j++) {
      if (ep.clips[j].id === clipId) {
        return { id: ep.clips[j].id, vid: ep.clips[j].vid, title: ep.clips[j].title, ep: ep.ep };
      }
    }
  }
  return null;
}

// ── Init ──
document.addEventListener('DOMContentLoaded', function () {
  var isFirst = true;
  try { isFirst = !localStorage.getItem('kt-visited'); } catch (e) {}

  loadEpisodesData().then(function () {
    renderEpGrid();
    if (isFirst) {
      document.getElementById('v-home').classList.remove('hidden');
    } else {
      document.getElementById('v-dash').classList.remove('hidden');
      renderDashboard();
    }
  }).catch(function () {
    // Fallback: show landing if data fails to load
    document.getElementById('v-home').classList.remove('hidden');
  });
});
