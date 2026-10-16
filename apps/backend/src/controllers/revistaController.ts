import type { Request, Response } from "express";
import { RevistaService } from "../services/revistaService.js";
import { fileUtils } from "../utils/fileUtils.js";
import { Prisma } from "@diorama/db";
import { PUBLIC_API_URL } from "../config/enviroments.js";
import { cleanHtml } from "../utils/cleanHtml.js";

const service = new RevistaService();

function parseAutores(body: Record<string, unknown>): string[] | undefined {
    if (body.autores !== undefined) {
        const input = typeof body.autores === "string" ? JSON.parse(body.autores) : body.autores;
        if (!Array.isArray(input) || input.length > 30 || input.some(nome => typeof nome !== "string" || !nome.trim() || nome.length > 200)) {
            throw new Error("Informe uma lista válida de autores.");
        }
        return [...new Set(input.map(nome => (nome as string).trim()))];
    }
    if (body.autor !== undefined) {
        if (typeof body.autor !== "string" || body.autor.length > 200) throw new Error("Informe uma autoria válida.");
        return body.autor.trim() ? [body.autor.trim()] : [];
    }
    return undefined;
}

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
        const files = (req.files ?? {}) as ArquivosRevista;


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

            const baseUrl = `${PUBLIC_API_URL}/static`;
            const imagemDestaqueUrl = baseUrl + '/imagemDestaqueRevistas/' + imagemDestaque?.filename;
            const revistaPdfUrl = baseUrl + '/pdfRevistas/' + revistaPdf?.filename;

            const autores = parseAutores(req.body);
            const dataRevista = {
                edicaoId: edicaoId,
                titulo: titulo,
                conteudo_html: cleanHtml(conteudo_html),
                imagemDestaque: imagemDestaqueUrl,
                pdfUrl: revistaPdfUrl,
                ...(autores !== undefined ? { autores } : {}),
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
        const files = (req.files ?? {}) as ArquivosRevista;




        const baseUrl = `${PUBLIC_API_URL}/static`;

        const dataRevista:Prisma.RevistaUpdateInput={};

        if(!id) return res.status(400).json({mensagem: "O id não foi fornecido."});

        if (req.body.titulo) {
            dataRevista.titulo = req.body.titulo;
        }

        if (req.body.conteudo_html) {
            dataRevista.conteudo_html = cleanHtml(req.body.conteudo_html);
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

        try {
            if (req.body.edicaoId !== undefined) {
                if (typeof req.body.edicaoId !== "string" || !req.body.edicaoId.trim()) throw new Error("Informe uma edição válida.");
                dataRevista.edicao = { connect: { id: req.body.edicaoId } };
            }
            const autores = parseAutores(req.body);
            if (autores !== undefined) dataRevista.autores = { deleteMany: {}, create: autores.map(nome => ({ nome })) };
        } catch {
            fileUtils.apagarArquivo(files.revistaPdf?.[0]?.path);
            fileUtils.apagarArquivo(files.imagemDestaque?.[0]?.path);
            return res.status(400).json({ mensagem: "Informe edição e autoria válidas." });
        }

        if(!dataRevista.pdfUrl && !dataRevista.imagemDestaque && !dataRevista.conteudo_html && !dataRevista.titulo && !dataRevista.edicao && !dataRevista.autores) return res.status(400).json({mensagem: "Nenhum dado foi fornecido para alteração do regsitro."})

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
