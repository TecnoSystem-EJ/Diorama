import { db, Prisma, UsuarioRole } from "@diorama/db";
import bcrypt from "bcrypt";

/*
 id: number;
    username: string;
    email: string;
    senhaHash: string;
    role: $Enums.UsuarioRole;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
*/


export class UsuarioService {

    async listar() {
        return await db.usuario.findMany({
            where:{
                deleted:false
            }
        });
    }


    async buscar(email:string) {
        return await db.usuario.findUnique({
            where: { email:email }
        });
    }

    async cadastrar(data:{
        username: string,
        email: string,
        senha: string,
        role: UsuarioRole
    }){

        const senhaHash = await bcrypt.hash(data.senha, 10)
        return await db.usuario.create({
            data:{
                username:data.username,
                email:data.email,
                senhaHash: senhaHash,
                role:data.role
            }
        })
    }

    async desativarRegistro(id:number){
        return await db.usuario.update({
            where:{
                id
            },
            data:{
                deleted:true,
                deletedAt:new Date()
            }
        })
    }

    async deletar(id:number){
        return await db.usuario.delete({
            where:{
                id
            }
        })
    }

    async editar(id:number, data:Prisma.UsuarioUpdateInput){
        return await db.usuario.update({
            where:{
                id:id
            },
            data
        })
    }


}