// const UserSchema = new mongoose.Schema({
//     username: String,
//     posts: [{
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Post'
//     }]
//   })
// const PostSchema = new mongoose.Schema({
//     content: String,
//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     }
//   })
// const Post = mongoose.model('Post', PostSchema, 'posts');
//   const User = mongoose.model('User', UserSchema, 'users');
// module.exports = {
//     User, Post,
//   }








//   var PackageSchema = new Schema({
//     id: ObjectId,
//     title: { type: String, required: true },
//     flashcards: [ {type : mongoose.Schema.ObjectId, ref : 'Flashcard'} ]
// });

// var FlashcardSchema = new Schema({
//     id: ObjectId,
//     type: { type: String, default: '' },
//     story: { type: String, default: '' },
//     packages: [ {type : mongoose.Schema.ObjectId, ref : 'Package'} ]
// });



// let product = new prodSch(req.body); 

// product.save(function(err, product) {
//   userSch.findById(userId, function(err, user) {
//     user.Productlist.push(product);
//     user.save(function(err, user) {
//       ...done...
//     });
//   });
// });