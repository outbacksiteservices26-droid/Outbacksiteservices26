// All project photos. Photos only, no descriptions: the sets used to be
// labelled with property names, which are client information and do not
// belong on the public site. Each set still renders as its own section in
// the original order; the photo files live in generic dated folders.
(function () {
  var grid = document.getElementById('victor-gallery');
  var countEl = document.getElementById('victor-count');
  if (!grid) return;

  function card(photo) {
    var figure = document.createElement('figure');
    figure.className = 'work-card';
    var link = document.createElement('a');
    link.className = 'work-photo';
    link.href = photo.src;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', 'View full-size photo: Outback Site Services project photo');
    var img = document.createElement('img');
    img.src = photo.src;
    img.alt = 'Outback Site Services project photo';
    img.loading = 'lazy';
    img.decoding = 'async';
    link.appendChild(img);
    figure.appendChild(link);
    return figure;
  }

  fetch('victor-gallery.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var sets = data.sets || [];
      var photos = data.photos || [];
      var bySet = {};
      sets.forEach(function (s) { bySet[s.id] = []; });
      photos.forEach(function (p) { if (bySet[p.set]) bySet[p.set].push(p); });
      sets.forEach(function (set) {
        var section = document.createElement('div');
        section.className = 'victor-set';
        var g = document.createElement('div');
        g.className = 'work-grid';
        bySet[set.id].forEach(function (p) { g.appendChild(card(p)); });
        section.appendChild(g);
        grid.appendChild(section);
      });
      if (countEl) countEl.textContent = 'Showing ' + photos.length + ' of ' + photos.length + ' project photos.';
    })
    .catch(function () {
      grid.innerHTML = '<p>Project photos could not be loaded. Please try again later.</p>';
    });
})();
