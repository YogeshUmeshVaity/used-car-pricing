import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

// Partial helps us in type safety. e.g. if we write Promise.resolve(123) in the find function below,
// TypeScript will give error saying we need to pass a User[] instead of a number.
describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // Temporary testing DI container which contains the list of classes and their dependencies.
    const module = await Test.createTestingModule({
      // List of things we want to register in our 'testing' DI container.
      providers: [
        AuthService,
        {
          provide: UsersService,
          // If anyone asks for UsersService, give them this object.
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    // Makes the DI container to create a instance of the AuthService with all of its different
    // dependencies already initialized using the components specified in module creation above.
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async (done) => {
    await service.signup('asdf@asdf.com', 'asdf');
    try {
      await service.signup('asdf@asdf.com', 'asdf');
    } catch (err) {
      done();
    }
  });

  it('throws if signin is called with an unused email', async (done) => {
    try {
      await service.signin('asdflkj@asdlfkj.com', 'passdflkj');
    } catch (err) {
      done();
    }
  });

  it('throws if an invalid password is provided', async (done) => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    try {
      await service.signin('laskdjf@alskdfj.com', 'laksdlfkj');
    } catch (err) {
      done();
    }
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdf@asdf.com', 'mypassword');

    const user = await service.signin('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
