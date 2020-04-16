
// здесь будет массив с парковками
const placemarks = [{
  // Широта метки
  latitude: 55.77,
  // Долгота метки
  longitude: 37.48,
  // Добавляем Hint
  hintContent: '<div class="map__hint">Здесь будет адрес или название парковки</div>',
  // Добавляем baloon
  balloonContent: [
    '<div class="map__balloon">',
    '<img class="map__icon-img " src="img/icon.jpg" alt="Parking"/>',
    'Какой-то текст с описанием',
    '</div>',
  ].join(''),
},
{
  // Широта метки
  latitude: 59.94,
  // Долгота метки
  longitude: 30.25,
  // Добавляем Hint
  hintContent: '<div class="map__hint">Здесь будет адрес или название парковки</div>',
  // Добавляем baloon
  balloonContent: [
    '<div class="map__balloon">',
    '<img class="map__icon-img" src="img/icon.jpg" alt="Parking"/>',
    'Какой-то текст с описанием',
    '</div>',
  ].join(''),
},
{
  // Широта метки
  latitude: 59.93,
  // Долгота метки
  longitude: 30.34,
  // Добавляем Hint
  hintContent: '<div class="map__hint">Здесь будет адрес или название парковки</div>',
  // Добавляем baloon
  balloonContent: [
    '<div class="map__balloon">',
    '<img class="map__icon-img " src="img/icon.jpg" alt="Parking"/>',
    'Какой-то текст с описанием',
    '</div>',
  ].join(''),
}];


// Инициализируем карту
ymaps.ready(init);

function init() {
  // Создаём конструктор карты и привязываем к диву карты

  ymaps.ready(() => {
    const map = new ymaps.Map('map', {
      // указываем центр карты
      center: [59.94, 30.32],
      // указываем коэффициент масштабирования
      zoom: 12,
      // controls позволяет добавлять или убирать элементы нак карту
      controls: ['zoomControl', 'geolocationControl'],
      // Убираем зум скроллом с карты
      // behaviors: ['drag'],
    });
    const location = ymaps.geolocation;

    // Получение местоположения и автоматическое отображение его на карте.
    location.get({
      mapStateAutoApply: true,
    })
      .then(
        (result) => {
          // Получение местоположения пользователя.
          const userAddress = result.geoObjects.get(0).properties.get('text');
          const userCoodinates = result.geoObjects.get(0).geometry.getCoordinates();
          // Пропишем полученный адрес в балуне.
          result.geoObjects.get(0).properties.set({
            balloonContentBody: `Адрес: ${userAddress
            }<br/>Координаты:${userCoodinates}`,
          });
          map.geoObjects.add(result.geoObjects);
        },
        (err) => {
          console.log(`Ошибка: ${err}`);
        },
      );


    // Добавляем каждую парковку на карту
    placemarks.forEach((obj) => {
      const placemark = new ymaps.Placemark([obj.latitude, obj.longitude], {
        hintContent: obj.hintContent,
        balloonContent: obj.balloonContent,
      },
      {
        iconLayout: 'default#image',
        iconImageHref: '../img/metka.png',
        iconImageSize: [46, 57],
        iconImageOffset: [-23, -57],
      });
      // Добавляем метку на карту
      map.geoObjects.add(placemark);
    });
  });
}
