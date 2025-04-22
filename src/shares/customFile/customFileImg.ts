import { HttpException, HttpStatus } from '@nestjs/common';
import { memoryStorage } from 'multer'; // 👈 thay vì diskStorage
import { extname } from 'path';

function CustomFileImg() {
  return {
    storage: memoryStorage(), // ✅ sửa ở đây

    // diskStorage({ // cho local
    //   destination: './upload/posters',
    //   filename: (req, file, cb) => {
    //     const name = Date.now() + '_' + file.originalname;
    //     cb(null, name);
    //   },
    // }),

    limits: {
      fieldSize: 1 * 1024 * 1024,
    },
    fileFilter: (req: any, file: any, cb: any) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        cb(null, true);
      } else {
        cb(
          new HttpException(
            `Unsupported file type ${extname(file.originalname)}`,
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      }
    },
  };
}

export default CustomFileImg;
