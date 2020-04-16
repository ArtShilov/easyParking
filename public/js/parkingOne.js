


document.getElementsByTagName('body')[0].addEventListener('click',async (event)=>{
// console.log('sdfkjnsdgkjsdnakj');
// elem.classList.contains("example"))
if (event.target.classList.contains('editOneParkingButton')) {
  
  event.target.classList.add("editOneParkingButtonClose")

  event.target.classList.remove("editOneParkingButton")

    // console.log(event.target);
    document.getElementById('editFormOpen').innerHTML = `
    <form  >
    <div>
      <input type="text" name="name" placeholder="name">
    </div>
    <div>
      <input type="text" name="position" placeholder="position">
    </div>
    <div>
      <input type="text" name="description" placeholder="description">
    </div>
    <div>
      <input type="text" name="countAll" placeholder="countAll">
    </div>
    <div>
      <input type="text" name="price" placeholder="price">
    </div>
    <input type="submit" value="Отправить" class="editParkingForm">
  
  </form>`


  }

  if (event.target.classList.contains('editOneParkingButtonClose')) {
    // action="/org/edit" method="POST"
    // event.target.dataset.idPark
    // console.log(event.target);
    document.getElementById('editFormOpen').innerHTML = ``

    document.getElementsByClassName('editOneParkingButtonClose')[0].classList.add('editOneParkingButton')
    document.getElementsByClassName('editOneParkingButtonClose')[0].classList.remove('editOneParkingButtonClose')

  }


  if (event.target.classList.contains('editParkingForm')) {

    event

    // console.log(event.target);
    document.getElementById('editFormOpen').innerHTML = ``


  }


})
