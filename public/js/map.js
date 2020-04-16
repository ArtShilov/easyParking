// рисуем карту с текущим положением пользователя
ymaps.ready(() => {
  let map;

  ymaps.geolocation.get().then((res) => {
    const mapContainer = $('#map');
    const bounds = res.geoObjects.get(0).properties.get('boundedBy');
    // Рассчитываем видимую область для текущей положения пользователя.
    const mapState = ymaps.util.bounds.getCenterAndZoom(
      bounds,
      [mapContainer.width(), mapContainer.height()],
    );
    createMap(mapState);
  });

  function createMap(state) {
    map = new ymaps.Map('map', state);
  }
});

// Получаем коориданты пользователя
ymaps.ready(() => {
  ymaps.geolocation.get({
    prodiver: 'yandex',
  }).then((result) => {
    const g = result.geoObjects.get(0);
    console.log(g.geometry.getCoordinates());
  });
});
