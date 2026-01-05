import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findById(userId: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException("User with id isnt found");
        }
        return user;
    }

    async updateUser(userId: string, input: UpdateUserInput): Promise<User> {
        const user = await this.findById(userId);

        Object.assign(user, input);

        return this.userRepository.save(user);
    }

    async findByEmail(email: string): Promise<User| null> {
        return this.userRepository.findOneBy({ email });
    }

    async create(data: Partial<User>): Promise<User> {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
}
