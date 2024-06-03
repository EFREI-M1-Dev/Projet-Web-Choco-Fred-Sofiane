import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import consola from "consola";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    await app.listen(3000);
}

bootstrap().then(() => {
    consola.success('Server is running on http://localhost:3000');
}).catch((err) => {
    consola.error(err);
});
