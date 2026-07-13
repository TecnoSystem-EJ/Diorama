import { db } from "@diorama/db";
import { Prisma } from "@diorama/db";

export class RevistaService {

    async listar() {
        return await db.revista.findMany({
            where:{
                deleted:false
            }
        });
    }

    async buscar(id: string) {
        return await db.revista.findUnique({
            where: { id:id}
        });
    }

    async cadastrar(data:{
        edicaoId: string,
        titulo: string,
        conteudo_html: string,
        imagemDestaque: string,
        pdfUrl: string,
    }){
        return await db.revista.create({data})
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
