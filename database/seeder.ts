import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

import { PrismaClient, type Todo, type User } from '@prisma/client';
import { generateApiKey } from 'src/supports/str.support';

const prisma = new PrismaClient();

function CreateRandomUser(): User {
  return {
    id: createId(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
    apiKey: generateApiKey(),
  };
}

function CreateRandomTodo(): Todo {
  return {
    id: createId(),
    title: faker.lorem.sentence(),
    completed: faker.datatype.boolean(),
    userId: null,
  };
}

const USERS = faker.helpers.multiple(CreateRandomUser, {
  count: 10,
});

const TODOS = faker.helpers.multiple(CreateRandomTodo, {
  count: 10,
});

async function main() {
  await Promise.all([
    prisma.user.createMany({
      data: USERS,
    }),
    prisma.todo.createMany({
      data: TODOS.map((todo) => ({
        ...todo,
        userId: USERS[Math.floor(Math.random() * USERS.length)].id,
      })),
    }),
  ]);
}

// @ts-ignore: run with bun
await main();
