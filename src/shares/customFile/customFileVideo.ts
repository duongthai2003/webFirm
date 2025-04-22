import { HttpException, HttpStatus } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { extname } from 'path';

function CustomFileVideo() {
  return {
    storage: memoryStorage(),
    // diskStorage({  // dùng cái này để lưu vào forder nội bộ
    //   destination: './upload/videos',
    //   filename(req: any, file: any, callback: any) {
    //     const name = Date.now() + '_' + file.originalname;
    //     callback(null, name);
    //   },
    // }),
    fileFilter: (req: any, file: any, cb: any) => {
      if (file.mimetype.match('video')) {
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
    limits: {
      fileSize: 500 * 1024 * 1024, // Giới hạn video 500MB, tuỳ bạn
    },
  };
}
export default CustomFileVideo;
