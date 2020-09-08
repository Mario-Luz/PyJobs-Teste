import knex from "knex";
import { BaseDatabase } from "./BaseDatabase";
import { Transacao } from "../business/UserBusiness";

export class UserDatabase extends BaseDatabase {
    [x: string]: any;
   
    private static TABLE_NAME = "PDV";
    private static TRANSACAO_TABLE_NAME = "TRANSACAO"
    
    public async createUser(
        id: string,
        email: string,
        password: string
    ): Promise<void> {
        await this.getConnection()
            .insert({
                id,
                email,
                password
            })
            .into(UserDatabase.TABLE_NAME)
    }
    
    public async addTransacao(
        id: string,
        transacao: Transacao
    ): Promise<void> {
        await this.getConnection()
            .insert({
                user_id:id,
                value: `${transacao.estabelecimento}, ${transacao.cliente}, ${transacao.valor}, ${transacao.descricao},`, 
                updated_at:new Date()  
            })
            .into(UserDatabase.TRANSACAO_TABLE_NAME)
    }
    public async getUserByEmail(
        email: string
        ): Promise<any> {
        const result = await this.getConnection()
          .select("*")
          .from(UserDatabase.TABLE_NAME)
          .where({ email });
    
        return result[0];
    }
   
    
}



