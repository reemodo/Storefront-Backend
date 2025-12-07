import bcrypt from 'bcrypt';


const pepper = process.env.BCRYPT_PEPPER || '';
const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);


export async function hashPassword(password) {
const hashed = await bcrypt.hash(password + pepper, saltRounds);
return hashed;
}


export async function comparePassword(password, hash) {
return bcrypt.compare(password + pepper, hash);
}