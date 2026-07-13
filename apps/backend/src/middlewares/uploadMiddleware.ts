import multer from "multer";
import path from "node:path";
import crypto from "crypto";
import type { Request } from "express";
import fs from 'fs';


import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("criando pastas em static")
const capaPath = path.resolve(__dirname, "../..", "static/capas");
const revistaPath = path.resolve(__dirname, "../..", "static/pdfRevistas");
const destaquePath = path.resolve(__dirname, "../..", "static/imagemDestaqueRevistas");


const createFileDirs = ()=>{
    const dirs=[capaPath, revistaPath, destaquePath];

    dirs.forEach(dir => {
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir, {recursive:true});
        }
    })
}

createFileDirs();


const multerConf = {

    storage: multer.diskStorage({

        destination: (req, file, cb) =>{

            if(file.fieldname === "capa"){

                cb(null, capaPath);

            }else if(file.fieldname === "revistaPdf"){

                cb(null, revistaPath);
                
            }else if(file.fieldname === "imagemDestaque"){

                cb(null, destaquePath);
                
            }
        },

        filename:(req, file, cb)=>{
            const fileHash = crypto.randomBytes(10).toString('hex');
            const fileExtension = path.extname(file.originalname).toLowerCase();
            const fileName = fileHash + "_" + Date.now() + "_" + fileExtension;

            cb(null, fileName);
        }
    }),


    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) =>{

        if(file.fieldname === 'capa' || file.fieldname === 'imagemDestaque'){

            if(!file.mimetype.startsWith("image/")){

                return cb(new Error("O arquivo enviado no campo "+file.fieldname+" deve ser um arquivo de imagem."))

            }

        }else if(file.fieldname === "revistaPdf"){

            if(file.mimetype != "application/pdf"){

                return cb(new Error("O arquivo enviado no campo 'revista' deve ser do tipo PDF."))

            }

        }

        cb(null, true);

    },

   

}

export const uploadMiddleware = multer(multerConf);