import {db, Prisma} from "@diorama/db";


export class EdicaoService {

    async listar() {
        return await db.edicao.findMany({
            where: { deleted: false },
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { revistas: { where: { deleted: false } } } } },
        });
    }

    async buscar(id: string) {
        return await db.edicao.findUnique({
            where: { id, deleted: false },
            include: { revistas: { where: { deleted: false }, include: { autores: true } } },
        });
    }

    async cadastrar(data:{
        numeroTag: string,
        titulo: string,
        capaUrl: string,
        pdfUrl?: string,
    }){
        return await db.edicao.create({data})
    }

    async desativarRegistro(id:string){
        return await db.edicao.update({
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
        return await db.edicao.delete({
            where:{
                id
            }
        })
    }

    async editar(id:string, data:Prisma.EdicaoUpdateInput){
        return await db.edicao.update({
            where:{
                id:id, deleted: false
            },
            data
        })
    }

}
