import fs from 'fs';

export const fileUtils = {

    apagarArquivo: (filePath:string|undefined)=>{
    
        if (!filePath) return;
        

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    }
}