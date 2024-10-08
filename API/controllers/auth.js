import {db} from "../connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = (req, res)=>{

    const {email, senha} = req.body;

    db.query(

        "SELECT * FROM vendedor WHERE EMAIL= ?", [email], async(error, data)=>{

            if(error){
                return res.status(500).json({
                    msg:"O servidor esta indisponível no momento entre em contato com o suporte",
                });
            }
            if(data.length===0){
                
                return res.status(404).json({
                    msg:"Usuário não localizado ou Inválido",
                });
            
            }else{

                const usuario = data[0];
                const saltRounds = 10;
                const senhaHash = await bcrypt.hash(usuario.SENHA, saltRounds);
                const confereSenha = await bcrypt.compare(senha, senhaHash);

                if(!confereSenha){

                    return res.status(401).json({msg: 'Senha Incorreta'});

                }else{
                    try{
                        const atualizaToken=jwt.sign({
                            exp: Math.floor(Date.now()/1000) + 24 * 60 * 60,
                            id:usuario.SENHA
                        }, process.env.REFRESH,
                        {algorithm:"HS256"}
                        )
                        const token=jwt.sign({
                            exp: Math.floor(Date.now()/1000) + 3600,
                            id:usuario.SENHA
                        }, process.env.TOKEN,
                        {algorithm:"HS256"}
                        )
                        const usuarioLogado = {
                            NOME: usuario.NOME,
                            usuario_PARAMetro: usuario.usuario_PARAMetro
                        };
                        
                        return res.status(200).json({msg: 'Logado com sucesso',
                                                    data:{usuarioLogado,token:{token,atualizaToken}}
                                                });
                    }catch(err){
                        console.log(err);
                        return res.status(500).json({msg:'O servidor esta indisponível no momento entre em contato com o suporte'});
                    }
                }
            }
        }
    )

};
