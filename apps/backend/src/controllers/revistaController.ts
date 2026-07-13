import type { Request, Response } from "express";
import { RevistaService } from "../services/revistaService.js";
import { fileUtils } from "../utils/fileUtils.js";
import { Prisma } from "@diorama/db";

const service = new RevistaService();

interface ArquivosRevista {
  imagemDestaque?: Express.Multer.File[];
  revistaPdf?: Express.Multer.File[];
}



export class RevistaController {

    async listar(req: Request, res: Response) {

        const revistas = await service.listar();

        return res.json({quantidade: revistas.length, revistas:revistas});

    }

    async buscarPorId(req: Request, res: Response) {

        const {id} = req.params;

        
        if(!id) return res.status(400).json({mensagem: "O id não foi fornecido."});

        

        const revista = await service.buscar(id);

        if(!revista) return res.status(404).json({mensagem: "Revista não encontrada."})


        return res.json({revista:revista});

    }

    async criar(req: Request, res: Response) {


        const { edicaoId, titulo, conteudo_html} = req.body;
        const files = req.files as ArquivosRevista; 


        const revistaPdf = files.revistaPdf?.[0];
        const imagemDestaque = files.imagemDestaque?.[0];


        if (!revistaPdf || !imagemDestaque) {

            if(!revistaPdf) fileUtils.apagarArquivo(imagemDestaque?.path);

            if(!imagemDestaque) fileUtils.apagarArquivo(revistaPdf?.path);

            res.status(400).json({ message: "É necessário enviar a imagem de destaque e o pdf da revista." });
            return;
        }

        if (!titulo || !edicaoId || !conteudo_html) {

            fileUtils.apagarArquivo(imagemDestaque?.path);
            fileUtils.apagarArquivo(revistaPdf?.path);

            res.status(400).json({ message: "Parâmetros insuficientes." });
            return;
        }

        try {
            
            const baseUrl = `${req.protocol}://${req.get('host')}/static`;
            const imagemDestaqueUrl = baseUrl + '/imagemDestaqueRevistas/' + imagemDestaque?.filename;
            const revistaPdfUrl = baseUrl + '/pdfRevistas/' + revistaPdf?.filename;

            const dataRevista = {
                edicaoId: edicaoId,
                titulo: titulo,
                conteudo_html: conteudo_html,
                imagemDestaque: imagemDestaqueUrl,
                pdfUrl: revistaPdfUrl
            }

            const revista = await service.cadastrar(dataRevista)

            res.status(201).json({ mensagem: "Revista Cadastrada com sucesso!", revista: revista });

        } catch (error) {
            fileUtils.apagarArquivo(revistaPdf?.path);
            fileUtils.apagarArquivo(imagemDestaque?.path);
            res.status(400).json({error: error})
            
        }
    
    }

    async editar(req:Request, res:Response){

        const {id} = req.params;
        const files = req.files as ArquivosRevista; 


        

        const baseUrl = `${req.protocol}://${req.get('host')}/static`;

        const dataRevista:Prisma.RevistaUpdateInput={};

        if(!id) return res.status(400).json({mensagem: "O id não foi fornecido."});

        if (req.body.titulo) {
            dataRevista.titulo = req.body.titulo;
        }

        if (req.body.conteudo_html) {
            dataRevista.conteudo_html = req.body.conteudo_html;
        }

        if (files) {

            if(files.imagemDestaque){
                const imagemDestaque = files.imagemDestaque?.[0];
                dataRevista.imagemDestaque = baseUrl + '/imagemDestaqueRevistas/' + imagemDestaque?.filename;
            }
            
            

            if(files.revistaPdf){
                const revistaPdf = files.revistaPdf?.[0];
                dataRevista.pdfUrl = baseUrl + '/pdfRevistas/' + revistaPdf?.filename;
            }
            
        }

        if(!dataRevista.pdfUrl && !dataRevista.imagemDestaque && !dataRevista.conteudo_html && !dataRevista.titulo) return res.status(400).json({mensagem: "Nenhum dado foi fornecido para alteração do regsitro."})

        try{
            const revista = await service.editar(id, dataRevista);
            res.json({mensagem: "Revista editada com sucesso!", revista: revista})
        } catch (error) {
            fileUtils.apagarArquivo(files.revistaPdf?.[0]?.path);
            fileUtils.apagarArquivo(files.imagemDestaque?.[0]?.path);
            res.status(400).json({error: error});
            
        }

        
    }

    async desativarRegistro(req:Request, res:Response) {

        const {id} = req.params;
        if(!id) return res.status(400).json({mensagem: "O id não foi fornecido."});

        try{
            await service.desativarRegistro(id);
            res.json({mensagem: "Registro desativado com sucesso!"});
        }catch (error) {
            res.status(400).json({error: error});
            
        }
    }

}