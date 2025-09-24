import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Nếu upload thumbnail → lưu vào public/images/thumbnails
      if (file.fieldname === 'thumbnail') {
        cb(null, './public/images/thumbnails');
      }
      // Nếu upload slider → lưu vào public/images/slider
      else if (file.fieldname === 'slider') {
        cb(null, './public/images/slider');
      } else {
        cb(null, './public/images/others');
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
      );
    },
  }),
};
