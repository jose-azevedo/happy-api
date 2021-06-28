import {Request, Response} from 'express';
import {getRepository} from 'typeorm';
import User from '../models/User';
import * as Yup from 'yup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default {
    async create(req: Request, res: Response) {
        const {
            name,
            email,
            password
        } = req.body;

        let data = {
            name,
            email,
            password
        };

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required(),
            password: Yup.string().required()
        });

        await schema.validate(data, {
            abortEarly: false
        });
        
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) {
                console.log(err);
                return res.status(500);
            } else {
                data.password = hash;
                console.log(data);
                const usersRepository = getRepository(User);

                const user = usersRepository.create(data);

                usersRepository.save(user);

                return res.status(201).json(user);

            }
        });

    },

    async login(req: Request, res: Response) {

        const {email, password} = req.body;

        const usersRepository = getRepository(User);
        const user = await usersRepository.findOneOrFail({where: {email: email}});

        bcrypt.compare(password, user.password, function(err, result){
            if(result) {
                console.log('Senha correta!')

                const accessToken = jwt.sign({email: email}, process.env.ACCESS_TOKEN_SECRET as string);

                return res.status(200).json({accessToken: accessToken});
            } else {
                console.log('Senha incorreta :c')
                return res.status(403);
            }
        })

    }
}