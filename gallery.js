// Our Work gallery for Outback Site Services.
// Renders the 79 project photos from gallery.json into the original
// work grid. Photos only, no captions or category filters.
(function () {
  var grid = document.querySelector('[data-work-grid]');
  var empty = document.querySelector('[data-work-empty]');
  var countEl = document.getElementById('gallery-count');
  if (!grid) return;

  function card(photo) {
    var figure = document.createElement('figure');
    figure.className = 'work-card';
    var link = document.createElement('a');
    link.className = 'work-photo';
    link.href = photo.src;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', 'View full-size photo: ' + photo.alt);
    var img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 206;
    img.height = 206;
    link.appendChild(img);
    figure.appendChild(link);
    return figure;
  }

  fetch('gallery.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var photos = data.photos || [];
      photos.forEach(function (p) { grid.appendChild(card(p)); });
      if (empty) empty.hidden = true;
      grid.hidden = false;
      if (countEl) countEl.textContent = 'Showing ' + photos.length + ' of ' + photos.length + ' project photos.';
    })
    .catch(function () {
      // Leave the "Project photos coming soon" empty state visible.
    });
})();
