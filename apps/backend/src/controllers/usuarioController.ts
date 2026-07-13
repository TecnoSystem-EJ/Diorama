import type { Request, Response } from "express";
import { UsuarioService } from "../services/usuarioService.js";
import { Prisma, UsuarioRole } from "@diorama/db";


const service = new UsuarioService();


export class UsuarioController {

    async listar(req: Request, res: Response) {

        const usuarios = await service.listar();

        return res.json({quantidade: usuarios.length, usuarios:usuarios});

    }

    async buscarPorEmail(req: Request, res: Response) {

        const { email } = req.params;

        
        if(!email) return res.status(400).json({mensagem: "O email não foi fornecido."});


        

        const usuario = await service.buscar(email);

        if(!usuario) return res.status(404).json({mensagem: "usuario não encontrado."})


        return res.json({usuario:usuario});

    }

    async criar(req: Request, res: Response) {


        const { username, email, senha, role} = req.body;

        if (!username || !email || !senha || !role) {

            return res.status(400).json({ message: "Parâmetros insuficientes." });
        }

        let dataRole:UsuarioRole

        if(role === "admin"){
            dataRole = UsuarioRole.ADMIN
        }else if(role === "autor"){
            dataRole = UsuarioRole.AUTOR
        }else{
            return res.status(400).json({mensagem: "Tipo de usuário inexistente."})
        }


        try {
            const dataUsuario = {
                email: email,
                username: username,
                senha: senha,
                role: dataRole
            }

            const usuario = await service.cadastrar(dataUsuario)

            res.status(201).json({ mensagem: "Usuário Cadastrado com sucesso!", usuario: usuario });

        } catch (error) {
            res.status(400).json({error: error})
            
        }
    
    }

    async editar(req:Request, res:Response){

        const {id} = req.params;

        
        
        if(!id) return res.status(400).json({mensagem: "O id não foi fornecido."});

        const numId = Number(id);
        if(isNaN(numId)) return res.status(400).json({mensagem: "Usuário inválido."});

        let dataUsuario:{
            username?:string,
            email?:string,
            senha?:string,
            role?:UsuarioRole
        } = {};

        if (req.body.username) {
            dataUsuario.username = req.body.username;
        }

        if (req.body.email) {
            dataUsuario.email = req.body.email;
        }

        if (req.body.senha) {
            dataUsuario.senha = req.body.senha;
        }


        if (req.body.role) {

            if(req.body.role === "admin"){
                dataUsuario.role = UsuarioRole.ADMIN
            }else if(req.body.role === "autor"){
                dataUsuario.role = UsuarioRole.AUTOR
            }else{
                return res.status(400).json({mensagem: "Tipo de usuário inexistente."})
            }
            
        }


        if(!dataUsuario.email && !dataUsuario.username && !dataUsuario.senha && !dataUsuario.role) return res.status(400).json({mensagem: "Nenhum dado foi fornecido para alteração do regsitro."})

        try{
            const usuario = await service.editar(numId, dataUsuario);

            res.json({mensagem: "Usuário editado com sucesso!", usuario: usuario})

        } catch (error) {
            res.status(400).json({error: error});
            
        }

        
    }

    async desativarRegistro(req:Request, res:Response) {

        const {id} = req.params;
        if(!id) return res.status(400).json({mensagem: "O id não foi fornecido."});

        const numId = Number(id);
        if(isNaN(numId)) return res.status(400).json({mensagem: "Usuário inválido."});

        try{
            await service.desativarRegistro(numId);
            res.json({mensagem: "Registro desativado com sucesso!"});
        }catch (error) {
            res.status(400).json({error: error});
            
        }
    }

}