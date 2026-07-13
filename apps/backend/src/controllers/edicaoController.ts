import type { Request, Response } from "express";
import { EdicaoService } from "../services/edicaoService.js";
import { fileUtils } from "../utils/fileUtils.js";
import { Prisma } from "@diorama/db";

const service = new EdicaoService();
// interface MagazineFiles {
//   capa?: Express.Multer.File[];
// }

export class EdicaoController {
    async listar(req: Request, res: Response) {
    
        const edicoes = await service.listar();

        return res.json({quantidade: edicoes.length, edicoes:edicoes});

    }
    
    async buscarPorId(req: Request, res: Response) {

        const {id} = req.params;

        
        if(!id) return res.status(400).json({mensagem: "O id não foi fornecido."});

        

        const edicao = await service.buscar(id);

        if(!edicao) return res.status(404).json({mensagem: "Edição não encontrada."})


        return res.json({edicao:edicao});

    }

    async criar(req: Request, res: Response) {

        const { titulo, numeroTag } = req.body;
        const capaFile = req.file               




        if (!capaFile) {
            res.status(400).json({ message: "É necessário enviar a imagem de capa." });
            return;
        }

        if (!titulo || !numeroTag) {

            fileUtils.apagarArquivo(capaFile?.path);

            res.status(400).json({ message: "Parâmetros insuficientes." });
            return;
        }

        try {
            
            const baseUrl = `${req.protocol}://${req.get('host')}/static`;
            const capaUrl = baseUrl + '/capas/' + capaFile?.filename;

            const dataEdicao = {
                numeroTag: numeroTag,
                titulo: titulo,
                capaUrl: capaUrl
            }

            const edicao = await service.cadastrar(dataEdicao)

            res.status(201).json({ mensagem: "Edição Cadastrada com sucesso!", edicao: edicao });

        } catch (error) {
            fileUtils.apagarArquivo(capaFile?.path);
            res.status(400).json({error: error})
            
        }
    
    }

    async editar(req:Request, res:Response){

        const {id} = req.params;


        

        const baseUrl = `${req.protocol}://${req.get('host')}/static`;

        const dataEdicao:Prisma.EdicaoUpdateInput={};

        if(!id) return res.status(400).json({mensagem: "O id não foi fornecido."});

        if (req.body.titulo) {
            dataEdicao.titulo = req.body.titulo;
        }

        if (req.body.numeroTag) {
            dataEdicao.numeroTag = req.body.numeroTag;
        }

        if (req.body.file) {

            const capaUrl = baseUrl + '/capas/' + req.body.file.filename;
            dataEdicao.capaUrl=capaUrl;

        }

        if(!dataEdicao.titulo && !dataEdicao.capaUrl && !dataEdicao.numeroTag) return res.status(400).json({mensagem: "Nenhum dado foi fornecido para alteração do regsitro."})

        try{
            const edicao = await service.editar(id, dataEdicao);
            res.json({mensagem: "Edição editada com sucesso!", edicao: edicao})
        } catch (error) {
            fileUtils.apagarArquivo(req.body.file.path);
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