import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

function CustomFileImg() {
  return {
    storage: diskStorage({
      destination: './upload/posters',
      filename: (req, file, cb) => {
        const name = Date.now() + '_' + file.originalname;
        cb(null, name);
      },
    }),
    limits: {
      fieldSize: 1 * 1024 * 1024,
    },
    // quy dinh nhan loai file
    fileFilter: (req: any, file: any, cb: any) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp )$/)) {
        // Allow storage of file
        cb(null, true);
      } else {
        // Reject file
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
