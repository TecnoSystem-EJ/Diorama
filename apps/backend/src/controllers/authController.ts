import type { Request, Response } from "express";
import { UsuarioService } from "../services/usuarioService.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/enviroments.js";

const service = new UsuarioService();

export class AuthController{

    async login(req:Request, res:Response){
        
        const {email, senha} = req.body;

        if(!email || !senha) return res.status(400).json({mensagem: "Email ou senha não fornecidos."});

        try{
            const usuario = await service.buscar(email);

            if(!usuario) return res.status(400).json({mensagem: "Usuário ou senha incorretos."});

            const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);

            if(!senhaValida) return res.status(400).json({mensagem: "Usuário ou senha incorretos."});

            const token = jwt.sign(
                {
                    id:usuario.id,
                    role:usuario.role
                },
                JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );

            res.json({mensagem:"Login realizado com sucesso!!", token:token});


        }catch(error){
            res.status(400).json({error:error})
        }
    }
}