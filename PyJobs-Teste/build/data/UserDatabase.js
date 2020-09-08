"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDatabase = void 0;
const BaseDatabase_1 = require("./BaseDatabase");
class UserDatabase extends BaseDatabase_1.BaseDatabase {
    createUser(id, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getConnection()
                .insert({
                id,
                email,
                password
            })
                .into(UserDatabase.TABLE_NAME);
        });
    }
    addTransacao(id, transacao) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getConnection()
                .insert({
                user_id: id,
                value: `${transacao.estabelecimento}, ${transacao.cliente}, ${transacao.valor}, ${transacao.descricao},`,
                updated_at: new Date()
            })
                .into(UserDatabase.TRANSACAO_TABLE_NAME);
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getConnection()
                .select("*")
                .from(UserDatabase.TABLE_NAME)
                .where({ email });
            return result[0];
        });
    }
}
exports.UserDatabase = UserDatabase;
UserDatabase.TABLE_NAME = "PDV";
UserDatabase.TRANSACAO_TABLE_NAME = "TRANSACAO";
