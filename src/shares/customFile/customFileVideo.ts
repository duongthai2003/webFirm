import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

function CustomFileVideo() {
  return {
    storage: diskStorage({
      destination: './upload/videos',
      filename(req: any, file: any, callback: any) {
        const name = Date.now() + '_' + file.originalname;
        callback(null, name);
      },
    }),
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
  };
}
export default CustomFileVideo;
