// All project photos – Victor / Elite Shine Cleaning sets.
// Renders one section per set from victor-gallery.json, grouped by
// property and date. Labelling rules (do not change without checking
// the inventory in ~/workspace/goals/outback-our-work-gallery/):
// - Only G102 and H302 are confirmed complete before/after pairs.
// - South Maradona and Shinnerock are mixed before-and-after sets:
//   individual photos are NOT labelled before or after.
// - Kentucky Drive is project photos only, not a before/after pair.
// - The Oct 25 before set and Oct 30 after set are NOT presented as
//   a matched pair (same property not confirmed).
// - No per-photo room categories are guessed.
(function () {
  var grid = document.getElementById('victor-gallery');
  var countEl = document.getElementById('victor-count');
  var filterWrap = document.getElementById('victor-filters');
  if (!grid) return;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function card(photo, set) {
    var figure = el('figure', 'gallery-card');
    figure.dataset.set = set.id;
    var link = document.createElement('a');
    link.href = photo.src;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', 'View full-size photo: Outback Site Services project photo, ' + set.name + ' — ' + set.label);
    var img = document.createElement('img');
    img.src = photo.src;
    img.alt = 'Outback Site Services project photo — ' + set.name + ', ' + set.label + ', ' + set.display_date;
    img.loading = 'lazy';
    var cap = el('figcaption');
    var cat = el('span', 'cat', set.name + ' — ' + set.label);
    var sub = el('span', 'cap', set.display_date);
    cap.appendChild(cat);
    cap.appendChild(sub);
    link.appendChild(img);
    figure.appendChild(link);
    figure.appendChild(cap);
    return figure;
  }

  function setCount(visible, total) {
    if (countEl) countEl.textContent = 'Showing ' + visible + ' of ' + total + ' project photos.';
  }

  fetch('victor-gallery.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var sets = data.sets || [];
      var photos = data.photos || [];
      var bySet = {};
      sets.forEach(function (s) { bySet[s.id] = []; });
      photos.forEach(function (p) { if (bySet[p.set]) bySet[p.set].push(p); });

      // One filter button per set name; G102 and H302 are single buttons
      // that show both their before and after sections (a confirmed pair).
      var filterTargets = [];
      var seenNames = {};
      sets.forEach(function (s) {
        if (s.pair_with && seenNames[s.name]) return;
        seenNames[s.name] = true;
        var ids = [s.id];
        if (s.pair_with) ids.push(s.pair_with);
        var total = ids.reduce(function (n, id) { return n + bySet[id].length; }, 0);
        filterTargets.push({ key: s.name, label: s.name + ' — ' + s.display_date, ids: ids, count: total });
      });

      sets.forEach(function (set) {
        var section = el('div', 'victor-set');
        section.dataset.set = set.id;
        var heading = el('h3', null, set.name + ' — ' + set.label);
        var meta = el('p', 'victor-meta', set.display_date + ' · ' + bySet[set.id].length + ' photos');
        section.appendChild(heading);
        section.appendChild(meta);
        if (set.pair_note) {
          section.appendChild(el('p', 'victor-note', 'Before-and-after pair: the matching ' + (set.group === 'before' ? 'after' : 'before') + ' photos are in the next section.'));
        }
        var g = el('div', 'gallery-grid');
        bySet[set.id].forEach(function (p) { g.appendChild(card(p, set)); });
        section.appendChild(g);
        grid.appendChild(section);
      });

      function applyFilter(target) {
        var visible = 0;
        grid.querySelectorAll('.victor-set').forEach(function (section) {
          var show = !target || target.ids.indexOf(section.dataset.set) !== -1;
          section.hidden = !show;
          if (show) visible += section.querySelectorAll('.gallery-card').length;
        });
        setCount(visible, photos.length);
      }

      function makeButton(label, target) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = label + (target ? ' (' + target.count + ')' : ' (' + photos.length + ')');
        b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () {
          filterWrap.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          applyFilter(target);
        });
        filterWrap.appendChild(b);
        return b;
      }

      var allBtn = makeButton('All sets', null);
      allBtn.setAttribute('aria-pressed', 'true');
      filterTargets.forEach(function (t) { makeButton(t.label, t); });

      setCount(photos.length, photos.length);
    })
    .catch(function () {
      grid.innerHTML = '<p>Project photos could not be loaded. Please try again later.</p>';
    });
})();
