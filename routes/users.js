var express = require('express');
var router = express.Router();
const user = require('../controllers/users')
const auth = require('../Middleware/auth')
const multer = require('multer');
const path = require('path'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be stored in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Middleware to serve static files (optional)
router.use(express.static('public'));

/* GET users listing. */
// router.get('/', function (req, res, next) {
//   res.send('respond with a resource');
// });
router.post('/', user.createUser)
router.get('/all',  user.getAllUsers)
router.get('/', auth.authenticate, user.getUserById)
router.delete('/', auth.authenticate, user.deleteUserById)
router.put('/', auth.authenticate, user.updateUser)
router.post('/login', user.login)
router.get('/search',user.getUsersByNameSearch)
router.post('/send-otp',user.sendOtp)
router.post('/verify-otp',user.verifyOtp)
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded!');
  }
//   res.send(`File uploaded successfully! Filename: ${req.file.filename}`);
  res.send({error:false,msg:"file uploaded successfully!",fileName:req.file.fileName,filePath:`/uploads/${req.file.filename}`})
});


module.exports = router;
