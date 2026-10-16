import { db } from "@diorama/db";
import { Prisma } from "@diorama/db";

export class RevistaService {

    async listar() {
        return await db.revista.findMany({
            where:{
                deleted:false,
                edicao: { deleted: false },
            },
            include: { edicao: true, autores: true },
            orderBy: { createdAt: "desc" },
        });
    }

    async buscar(id: string) {
        return await db.revista.findUnique({
            where: { id, deleted: false, edicao: { deleted: false } },
            include: { edicao: true, autores: true },
        });
    }

    async cadastrar(data:{
        edicaoId: string,
        titulo: string,
        conteudo_html: string,
        imagemDestaque: string,
        pdfUrl: string,
        autores?: string[],
    }){
        const { autores, ...revista } = data;
        return await db.revista.create({data: {
            ...revista,
            ...(autores?.length ? { autores: { create: autores.map(nome => ({ nome })) } } : {}),
        }})
    }

    async desativarRegistro(id:string){
        return await db.revista.update({
            where:{
                id
            },
            data:{
                deleted:true,
                deletedAt:new Date()
            }
        })
    }

    async deletar(id:string){
        return await db.revista.delete({
            where:{
                id
            }
        })
    }

    async editar(id:string, data:Prisma.RevistaUpdateInput){
        return await db.revista.update({
            where:{
                id:id
            },
            data
        })
    }

}
