import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util'

const scriptAsync = promisify<string, string, number, Buffer>(scrypt);

export class Password {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buf = await scriptAsync(password, salt, 64);

        return `${buf.toString('hex')}.${salt}`
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.')
        const buf = await scriptAsync(suppliedPassword, salt, 64);
        return buf.toString('hex') === hashedPassword;
    }
}
