# Dummy

API untuk dummy data. Mirip seperti (JSONPlaceholder)[https://jsonplaceholder.typicode.com]

Hanya saja ini dikhususkan untuk membuat dummy data untuk kelas di Neuversity.


## Setting Up the Database

Set up your `.env` file with the following configuration:

```env
DATABASE_URL="file:./dev.db"
```

Run the following command to push the Prisma schema to your SQLite database:

```bash
$ bunx prisma db push
```


## Installation

```bash
$ bun install
```

## Running the app

```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod
```


## Documentation

For detailed API documentation, visit (Dummy API Documentation)[https://dummy.binsarjr.com].


## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with a descriptive message.
4. Push your branch to your forked repository.
5. Open a Pull Request detailing your changes.


Ensure your code follows the project's coding standards and passes all tests. For any questions, feel free to open an issue.