import { UserDatabase } from "../data/UserDatabase";

export class UserBusiness {

    public async addTransacao(id:string, transacao: Transacao){
        const userDb = new UserDatabase();
         await userDb.addTransacao(id, transacao);
    }
   
    
}

export interface Transacao{
    estabelecimento:string
    cliente:string
    valor: string
    descricao: string
    
}

