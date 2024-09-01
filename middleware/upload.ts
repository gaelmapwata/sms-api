// eslint-disable-next-line import/no-extraneous-dependencies
import multer from 'multer';

console.log('on entre ici');

const upload = multer({ dest: 'uploads/' });

export default upload;
