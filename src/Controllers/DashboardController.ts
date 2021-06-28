import {Request, Response} from 'express';
import {getRepository} from 'typeorm';
import User from '../models/User';
import * as Yup from 'yup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Orphanage from '../models/Orphanage';

dotenv.config();

export default {
    async index(req: Request, res: Response) {
        const accessToken = req.headers.authorization?.split(' ')[1];
        console.log(typeof(accessToken))
        jwt.verify(accessToken as string, process.env.ACCESS_TOKEN_SECRET as string, async (err, decoded)=>{
            if(err) {
                return res.status(500)
            } else {
                console.log(decoded);

                const orphanagesRepository = getRepository(Orphanage);

                const orphanages = await orphanagesRepository.find({ select: ['name', 'latitude', 'longitude', 'id']});

                return res.status(200).json(orphanages);
            }
        })
    }
}