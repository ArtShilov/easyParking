let placemarks;
async function check() {
  const response = await fetch('/allparking');
  const result = await response.json();
  placemarks = result.parkings;
}
check().then(() => {
  console.log(placemarks);
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
        // console.log(typeof +obj.latitude, obj.latitude.slice(0, 5));

        const placemark = new ymaps.Placemark([+obj.longitude, +obj.latitude], {
          hintContent: `<div class="map__hint">${obj.position}</div>`,
          balloonContent: `<div class="map__balloon">
          <img class="map__icon-img " src="http://localhost:3000/img/icon.jpg" alt="Parking"/>
          <div class="ifoDiv">${obj.position}</div>
          <div class="ifoDiv">${obj.price}</div>
          <div class="ifoDiv">${obj.countAll}</div>
          <a class ="btn" href="/map/reserv/${obj._id}"> ЗАБРОНИРОВАТЬ</a>
          </div>`,
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
});
