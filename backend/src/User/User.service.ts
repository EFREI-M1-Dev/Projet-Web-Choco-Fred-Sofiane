import {Injectable} from '@nestjs/common';
import {User} from './User.model';
import {PrismaService} from "../prisma.service";
import {Prisma} from "@prisma/client";


@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {
    }

    async findOneById(id: number): Promise<User> | null {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            password: user.password,
        };
    }

    async createUser(data: User): Promise<User> {

        try {

            const user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    username: data.username,
                    password: data.password,
                },
            });

            if (!user) {
                throw new Error('User not created');
            }

            return {
                id: user.id,
                email: user.email,
                username: user.username,
                password: user.password,
            };

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error('Email already exists');
                }
            }
            throw new Error('User not created');
        }
    }

    async deleteUser(id: number): Promise<User> {
        const user = await this.prisma.user.delete({
            where: {
                id: id,
            },
        });

        if (!user) {
            throw new Error('User not deleted');
        }

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            password: user.password,
        };
    }

}