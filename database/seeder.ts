import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

import { PrismaClient, type Post, type Todo, type User } from '@prisma/client';
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

function CreateRandomPost(): Post {
  const id = createId();
  return {
    id,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    thumbnail: `https://picsum.photos/300/200?${id}`,
    userId: null,
  };
}

const USERS = faker.helpers.multiple(CreateRandomUser, {
  count: 10,
});

const TODOS = faker.helpers.multiple(CreateRandomTodo, {
  count: 10,
});

const POSTS = faker.helpers.multiple(CreateRandomPost, {
  count: 10,
});

async function main() {
  await prisma.user.createMany({
    data: USERS,
  });
  await Promise.all([
    prisma.todo.createMany({
      data: TODOS.map((todo) => ({
        ...todo,
        userId: USERS[Math.floor(Math.random() * USERS.length)].id,
      })),
    }),
    prisma.post.createMany({
      data: POSTS.map((post) => ({
        ...post,
        userId: USERS[Math.floor(Math.random() * USERS.length)].id,
      })),
    }),
  ]);
}

// @ts-ignore: run with bun
await main();
