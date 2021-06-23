import { auth, db, emailAuthProvider, storage } from './firebase-config';
class FirebaseService {

  get db() {
    return db.collection('products');
  }
  get dbUser() {
    return db.collection('accounts');
  }
  async createAccount(name, lastname, gender, card, email, password) {
    let authError;
    let dbError;
    const resAuth = await auth.createUserWithEmailAndPassword(email, password).catch((error) => authError = error);
    if (authError) { return this.handleError(authError) }
    const resDb = await db.collection('accounts').add({
      uid: resAuth.user.uid,
      type: 'customer',
      name: name,
      lastname: lastname,
      gender: gender,
      card: card,
      cart: []
    }).catch((error) => dbError = error);
    if (dbError) { return this.handleError(dbError) }
    return {
      status: 'success',
      userinfoid: resDb.id,
      type: 'customer',
    };

  }
  async signIn(email, password) {
    let signInerror;
    const res = await auth.signInWithEmailAndPassword(email, password).catch((error) => signInerror = error);
    if (signInerror != null) {
      return {
        status: 'error',
        message: this.handleError(signInerror)
      };
    }
    const uid = res.user.uid;
    console.log(uid);
    const customerRef = db.collection('accounts');
    let userinfo = await customerRef.where('uid', '==', uid).get().then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }
      return {
        docid: snapshot.docs[0].id,
        type: snapshot.docs[0].data()['type'],
      }
    })
      .catch(err => {
        console.log('Error getting documents', err);
      });
    return {
      status: 'success',
      userinfoid: userinfo.docid,
      type: userinfo.type
    };

  }

  async deleteAccount (infoId){
    let deleteAccount;
    const deletedAccount = await auth.currentUser.delete().catch((error)=>deleteAccount=error);
    const deletedInfoUser = await db.collection('accounts').doc(infoId).delete().catch((error)=>deleteAccount=error);
    if (deleteAccount) {console.log(deleteAccount);return false};
    sessionStorage.removeItem("currentUser");
    return true;
  }
  async logOut() {
    let logOuterror;
    const res = await auth.signOut().catch((error) => logOuterror = error);
    if (logOuterror) return false;
    sessionStorage.removeItem("currentUser");
    return true;
  }

  async registerProduct(
    name,
    description,
    type,
    amount,
    price,
    image,
    imageName
  ) {
    let imageError;
    const storageRef = storage.ref(name);
    const task = await storageRef.put(image).catch((error) => imageError = error);
    if (imageError) {
      return {
        status: 'error',
        message: imageError
      }
    }
    const imageurl = await storageRef.getDownloadURL();
    db.collection('products').add({
      name,
      description,
      type,
      amount,
      price,
      imageurl
    })
    return {
      status: 'success',
      message: 'product added'
    }

  }
  async deleteProduct(id, url) {
    let docError;
    let imgError
    var imgRef = storage.refFromURL(url);
    let deleteDoc = db.collection('products').doc(id).delete().catch((error) => docError = error);
    if (docError) { return this.handleError(docError) }
    imgRef.delete().catch((error) => imgError = error);
    if (imgError) { return this.handleError(imgError) }
    return 'Product deleted';
  }

  async editProduct(
    name,
    description,
    type,
    amount,
    price,
    image,
    imageName,
    editProduct
  ) {
    let imageError;
    let imageurl;
    if (image != null) {
      var imgRef = storage.refFromURL(editProduct.imageurl).delete();
      const storageRef = storage.ref(imageName);
      const task = await storageRef.put(image).catch((error) => imageError = error);
      if (imageError) {
        return {
          status: 'error',
          message: this.handleError(imageError)
        }
      }
      imageurl = await storageRef.getDownloadURL();
    }
    db.collection("products").doc(editProduct.id).update({
      name,
      description,
      type,
      amount,
      price,
      imageurl: imageurl ? imageurl : editProduct.imageurl
    });
    return {
      status: 'success',
      message: 'product edited'
    }
  }

  async addToCart(productId, docId,) {
    let cart = []
    const ref = await db.collection('accounts').doc(docId).get();
    const oldArray = ref.data()['cart'];
    cart = oldArray;
    cart.push(productId);
    db.collection('accounts').doc(docId).update({ cart });
  }


  async getProductsCart(productsIds) {
    let products = [];
    productsIds.forEach(async (id) => {
      const product = await db.collection('products').doc(id).get();
      products.push(products.data());
      console.log(product);
    });

    return products;
  }

  async deleteProductCart(docId, productId) {
    let cart = [];
    let deleteError;
    const ref = await db.collection('accounts').doc(docId).get();
    const oldArray = ref.data()['cart'];
    cart = oldArray.filter(item => item !== productId);
    db.collection('accounts').doc(docId).update({ cart }).catch((error) => { deleteError = error });
    if (deleteError) { return deleteError }
    return 'product removed from cart';
  }

  async makePayment(products, amount, customerid, productstotal) {
    let paymentError;
    let paymentError2;
    let userInfoError;
    let paymentdetails = []
    for (var i = 0; i < products.length; i++) {
      paymentdetails.push(
        {
          productname: products[i].name,
          productamount: amount[i],
          producttotal: products[i].price * amount[i],
          productid: products[i].id,
          imageurl: products[i].imageurl
        }
      );
      const productDoc = await db.collection('products').doc(products[i].id).get();
      let newamount;
      newamount = productDoc.data()['amount'] - amount[i];
      db.collection('products').doc(products[i].id).update({ amount: newamount }).catch((error) => { paymentError = error });
    }
    if (paymentError) { return this.handleError(paymentError) }
    db.collection('payments').add({
      customerid,
      paymentdetails,
      productstotal
    }).catch((error) => paymentError2 = error);
    if (paymentError2) { return this.handleError(paymentError2) }
    db.collection('accounts').doc(customerid).update({ cart: [] }).catch((error) => userInfoError = error);
    if (userInfoError) { return this.handleError(userInfoError) }
    return true;
  }
  async getPayments(customerid) {
    let paymentError;
    let payments = [];
    let paymentRef = db.collection('payments');
    let snapshot = await paymentRef.where('customerid', '==', customerid).get().catch((error) => paymentError == error);
    if (paymentError) { return this.handleError(paymentError) }
    snapshot.forEach((doc) => {
      let payment = doc.data();
      payment.paymentid = doc.id;
      payments.push(payment);
    })
    return payments;
  }
  async getAllPayments() {
    let paymentError;
    let payments = [];
    let paymentRef = db.collection('payments')
    let snapshot = await paymentRef.get().catch((error) => paymentError = error);
    if (paymentError) { return this.handleError(paymentError) }
    snapshot.forEach((payment) => {
      const id =payment.id;
      const info= {...payment.data(),id};
      payments.push(info);
    })
    return payments;
  }
  async updateUserInfo(userInfo) {
    let UpdateError;
    db.collection('accounts').doc(userInfo.id).update({
      card: userInfo.card,
      gender: userInfo.gender,
      lastname: userInfo.lastname,
      name: userInfo.name,
    }).catch((error) => UpdateError = error);
    if (UpdateError) { return this.handleError(UpdateError) }
    return true;
  }
  handleError(error) {
    let message;
    switch (error.message) {
      case 'The email address is already in use by another account.':
        message = 'El correo ya esta usado';
        break;
      case 'Password should be at least 6 characters':
        message = 'La contraseña necesita al menos 6 caracteres';
        break;
      case 'The email address is badly formatted.':
        message = 'La dirección de correo electrónico está mal formateada.'
        break;
      case 'There is no user record corresponding to this identifier. The user may have been deleted.':
        message = 'No hay ningún registro de usuario que corresponda a este identificador. Es posible que se haya eliminado al usuario.'
        break;
      case 'The password is invalid or the user does not have a password.':
        message = 'La contraseña no es válida o el usuario no tiene contraseña.'
        break;
      default:
        message = error.message
        break

    }
    return message;
  }



}














export default new FirebaseService();