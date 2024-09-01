// eslint-disable-next-line import/no-extraneous-dependencies
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

export default upload;
