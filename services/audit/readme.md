# Newlink Audit Service

The **Audit Service** provides a powerful and configurable database audit solution for your NestJS applications. 

---

## Features

1. **Configurable Database Audit**  
   - Turn on/off audit dynamically.  

---

## Installation

Install the Audit Service package:

```bash
npm install @newput-newlink/audit
```

---

## Configuration

The audit service requires configuration to turn on auditing. You can provide this configuration via **environment variables** or directly in the module.

### Environment Variables

| Environment Variable  | Required | Description                              | Default  |
| --------------------- | -------- | ---------------------------------------- | -------- |
| `ENALBE_DB_AUDIT`     | Yes      | Set true to enable the audit             | false    |
| `DISALBE_DB_AUDIT`    | No       | Set true if need to disable the audit    | false    |
| `DB_TYPE`             | Yes      | Database Type                            | `postgres`  |
| `DB_HOST`             | Yes      | Database host                            | `localhost` |
| `DB_PORT`             | No       | Database port                            | `5432`      |
| `DB_USERNAME`         | Yes      | Database username                        | None        |
| `DB_PASSWORD`         | Yes      | Database password                        | None        |
| `DB_NAME`             | Yes      | Name of the authentication database      | None        |


### Example `.env` File

```env
ENALBE_DB_AUDIT=true
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=auth_user
DB_PASSWORD=auth_password
DB_NAME=auth_db
```

---

## Usage

### Importing the Logger Module

```typescript
import { AuditModule } from '@newput-newlink/audit';

@Module({
  imports: [
    AuditModule.register({
      enable: true
    }),
  ],
})
export class AppModule {}
```

## Testing

Run unit tests to verify the audit functionality:

```bash
npm test
```

---

## Contributing

We welcome contributions to enhance the audit service. To contribute:

1. Fork the repository.  
2. Create a new feature branch.  
3. Implement your changes.  
4. Submit a pull request with a detailed explanation.  

---

## License

This module is licensed under the [MIT License](LICENSE).
