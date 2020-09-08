import * as jwt from "jsonwebtoken"


 export class Authenticator {
     private static EXPIRES_IN = "60min"
     public generateToken(input: AuthenticationData):string {
         const token = jwt.sign(
             {
                 id: input.id,
             },
             process.env.JWT_KEY as string,
             {
                 expiresIn:Authenticator.EXPIRES_IN,
             }
         )

         return token
     }

     public getData(token: string): AuthenticationData {
        const payload = jwt.verify(token, process.env.JWT_KEY as string) as any;
        const result = {
          id: payload.id,
        };
        return result;
      }
    }

 interface AuthenticationData {
     id: string
 }