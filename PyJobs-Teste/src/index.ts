import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response} from "express";
import { AddressInfo } from "net";
import { v4 } from "uuid"
import { IdGenerator } from "./services/IdGenerator";
import { UserDatabase } from "./data/UserDatabase";
import { Authenticator } from "./services/Authenticator";
import { HashManager } from "./services/HashManager";
import { BaseDatabase } from "./data/BaseDatabase";
import { UserBusiness, Transacao } from './business/UserBusiness';
import cors from "cors";

const id = v4();
console.log("Generated Id: ", id);

const app = express();
app.use(express.json());
app.use(cors())


const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});

app.post("/signup", async (req: Request, res: Response) => {
  try {
    // Item b. Validação do email
    if (!req.body.email || req.body.email.indexOf("@") === -1) {
      throw new Error("Invalid email");
    }
    // Item c. Validação da senha
    if (!req.body.password || req.body.password.length < 6) {
      throw new Error("Invalid password");
    }

    const userData = {
      email: req.body.email,
      password: req.body.password,
    };

    const idGenerator = new IdGenerator();
    const id = idGenerator.generate();

    const hashManager = new HashManager();
    const hashPassword = await hashManager.hash(userData.password);

    const userDb = new UserDatabase();
    await userDb.createUser(id, userData.email, hashPassword);

    const authenticator = new Authenticator();
    const token = authenticator.generateToken({
      id,
    });

    res.status(200).send({
      token,
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
  await BaseDatabase.destroyConnection();
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    // Item b. Validação do email
    if (!req.body.email || req.body.email.indexOf("@") === -1) {
      throw new Error("Invalid email");
    }

    const userData = {
      email: req.body.email,
      password: req.body.password,
    };

    const userDatabase = new UserDatabase();
    const user = await userDatabase.getUserByEmail(userData.email);
     
    const hashManager = new HashManager();
    const hashCompare = await hashManager.compare(userData.password, user.password); 
    

    if (!hashCompare) {
      throw new Error("Invalid password");
    }

    const authenticator = new Authenticator();
    const token = authenticator.generateToken({
      id: user.id,
    });

    res.status(200).send({
      token,
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }

  await BaseDatabase.destroyConnection();
});

app.get("/user/profile", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const authenticationData = authenticator.getData(token);

    const userDb = new UserDatabase();
    const user = await userDb.getUserById(authenticationData.id);

    res.status(200).send({
      id: user.id,
      email: user.email,
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
  await BaseDatabase.destroyConnection();
});


app.post("/transacao", async(req: Request, res: Response) =>{
  try{
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const authenticationData = authenticator.getData(token);
   
    const transacao = req.body.Transacao;
    const userBusiness = new UserBusiness();
    await userBusiness.addTransacao(authenticationData.id,transacao);
  
    res.status(200).send({
      message: "aceito: true"
    })
  }
  catch(err){
    res.status(400).send({
      message: err.message,
    });
  }
  
})
 