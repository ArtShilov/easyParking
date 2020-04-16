const User = require('./users');
const Parking = require('./parking');
const Organization = require('./organization');



async function metodSocialNetwork() {


  let Parking = await Parking.create({    
    name: "",
    position: { type: String, required: true },
    description: { type: String },
    countAll: { type: Number, required: true },
    countNow: { type: Number },
    price: { type: Number, required: true },
    password: { type: String, required: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  });




  // let user2 = await UserModel.create({
  //   name: 'Art Shilov',
  //   age: 28
  // });
  // let post1 = await PostModel.create({
  //   userID: [user1._id],
  //   text: faker.lorem.sentence(),// создание рандом текста
  //   like: [user2._id]
  // })
  // let comment1 = await CommentModel.create({
  //   userID: [user2._id],
  //   postID: [post1._id],
  //   text: faker.lorem.sentence(),
  // })
  // let commentAnswer = await CommentModel.create({
  //   userID: [user1._id],
  //   postID: [post1._id],
  //   text: faker.lorem.sentence(),
  //   parentID: [comment1._id] //здесь (это ответ на коментарий) ссылаюсь на id comment1 
  // })


  // Сделать дисконект
  mongoose.disconnect();
}

metodSocialNetwork() // вызов функции
