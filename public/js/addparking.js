const form = document.querySelector('#newparking');
form.addEventListener('submit', async ({ target }) => {
  event.preventDefault();
  const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=315b9fde-4c81-4d55-a862-8513d7e0f28b&format=json&geocode=${target.position.value}`);

  const json = await response.json();
  const coordinates = json.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
  const latitude = coordinates[0];
  const longitude = coordinates[1];

  const newParking = await fetch('/org/add', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      latitude,
      longitude,
      name: target.name.value,
      position: target.position.value,
      description: target.description.value,
      countAll: target.countAll.value,
      price: target.price.value,
    }),
  });
});
