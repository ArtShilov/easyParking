const form = document.querySelector('#newparking');
form.addEventListener('submit', async ({ target }) => {
  event.preventDefault();
  console.log(target.position.value);
  const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=315b9fde-4c81-4d55-a862-8513d7e0f28b&format=json&geocode=${target.position.value}`);
  console.log(response);
  const json = await response.json();
  console.log(json);
  const coordinates = json.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
  const latitude = coordinates[0];
  const longtitude = coordinates[1];
  console.log(coordinates);
  console.log(latitude, longtitude);
  const parking = {
    latitude,
    longtitude,
    name: target.name.value,
    position: target.position.value,
    description: target.description.value,
    countAll: target.countAll.value,
    // countNow: target.countNow.value,
    price: target.price.value,
    // password: target.password.value,
  };
  const newParking = await fetch('/org/add', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ parking }),
  });
  const jsonNewParking = newParking.json();
  console.log(jsonNewParking);
});
