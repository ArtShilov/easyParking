document
  .getElementsByTagName('body')[0]
  .addEventListener('click', async event => {

    if (event.target.classList.contains('editOneParkingButton')) {
      event.target.classList.add('editOneParkingButtonClose');
      event.target.classList.remove('editOneParkingButton');

      document.getElementById('editFormOpen').innerHTML = `
    <form  >
        <input required type='text' name='name' placeholder='name' value = '${document.getElementById(
          'parkingDescription'
        ).firstElementChild.textContent}'>
      <input required type='text' name='position' placeholder='position' value = '${document.getElementById(
        'parkingDescription'
      ).children[1].children[0].textContent}'>
      <input required type='text' name='description' placeholder='description' value = '${document.getElementById(
        'parkingDescription'
      ).children[1].children[1].textContent}'>
      <input required type='text' name='countAll' placeholder='countAll' value = '${document.getElementById(
        'parkingDescription'
      ).children[1].children[2].textContent}'>
      <input required type='text' name='price' placeholder='price' value = '${document.getElementById(
        'parkingDescription'
      ).children[1].children[3].textContent}'>
    <input type='submit' value='Отправить' class='editParkingForm' >
  
  </form>`;
    } else if (event.target.classList.contains('editOneParkingButtonClose')) {
      document.getElementById('editFormOpen').innerHTML = ``;


      event.target.classList.add('editOneParkingButton');
      event.target.classList.remove('editOneParkingButtonClose');
    } else if (event.target.classList.contains('editParkingForm')) {

      event.preventDefault();
      const target = event.target;

      const result = await (
        await fetch('/org/edit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: target.closest('form').name.value,
            position: target.closest('form').position.value,
            description: target.closest('form').description.value,
            countAll: target.closest('form').countAll.value,
            price: target.closest('form').price.value,
            id: target.closest('#editFormOpen').dataset.idpark
          })
        })
      ).json();

      // console.log(result);
      if (result.status == '200') {
        document.getElementById('editFormOpen').innerHTML = ``;

        document
          .getElementsByClassName('editOneParkingButtonClose')[0]
          .classList.add('editOneParkingButton');
        document
          .getElementsByClassName('editOneParkingButtonClose')[0]
          .classList.remove('editOneParkingButtonClose');

        // console.log(document.getElementById('parkingDescription').children[1]);

        document.getElementById(
          'parkingDescription'
        ).firstElementChild.textContent = target.closest('form').name.value;
        document.getElementById(
          'parkingDescription'
        ).children[1].children[0].textContent = target.closest(
          'form'
        ).position.value;
        document.getElementById(
          'parkingDescription'
        ).children[1].children[1].textContent = target.closest(
          'form'
        ).description.value;
        document.getElementById(
          'parkingDescription'
        ).children[1].children[2].textContent = target.closest(
          'form'
        ).countAll.value;
        document.getElementById(
          'parkingDescription'
        ).children[1].children[3].textContent = target.closest(
          'form'
        ).price.value;
      }else if (result.status == '400') {
        document.getElementsByClassName('editMessageSpan')[0].textContent = 'Заполните все поля'
      }
    }
  });
