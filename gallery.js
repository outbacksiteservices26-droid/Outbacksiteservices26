// Gallery for Outback Site Services – renders cards from gallery.json
(function () {
  var grid = document.getElementById('gallery-grid');
  var countEl = document.getElementById('gallery-count');
  var filterWrap = document.getElementById('gallery-filters');
  if (!grid) return;

  function card(photo) {
    var figure = document.createElement('figure');
    figure.className = 'gallery-card';
    figure.dataset.category = photo.category;
    var link = document.createElement('a');
    link.href = photo.src;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', 'View full-size photo: Outback Site Services ' + photo.alt);
    var img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt;
    img.loading = 'lazy';
    img.width = 206;
    img.height = 206;
    var cap = document.createElement('figcaption');
    var cat = document.createElement('span');
    cat.className = 'cat';
    cat.textContent = photo.category;
    var sub = document.createElement('span');
    sub.className = 'cap';
    sub.textContent = photo.caption;
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

  fetch('gallery.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var photos = data.photos || [];
      photos.forEach(function (p) { grid.appendChild(card(p)); });
      setCount(photos.length, photos.length);
      // Category filter buttons
      var cats = [];
      photos.forEach(function (p) { if (cats.indexOf(p.category) === -1) cats.push(p.category); });
      cats.forEach(function (cat) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = cat;
        b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () {
          var active = b.getAttribute('aria-pressed') === 'true';
          filterWrap.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', String(!active));
          var visible = 0;
          grid.querySelectorAll('.gallery-card').forEach(function (figure) {
            var show = active || figure.dataset.category === cat;
            figure.hidden = !show;
            if (show) visible++;
          });
          setCount(visible, photos.length);
        });
        filterWrap.appendChild(b);
      });
      var all = document.createElement('button');
      all.type = 'button';
      all.textContent = 'Show all';
      all.addEventListener('click', function () {
        filterWrap.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        grid.querySelectorAll('.gallery-card').forEach(function (f) { f.hidden = false; });
        setCount(photos.length, photos.length);
      });
      filterWrap.appendChild(all);
    })
    .catch(function () {
      grid.innerHTML = '<p>Gallery photos could not be loaded. Please try again later.</p>';
    });
})();
