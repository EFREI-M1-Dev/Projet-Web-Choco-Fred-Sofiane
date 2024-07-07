import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import consola from "consola";
import cors = require("cors");

export const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1', 'http://localhost:4173', 'https://projet-web-choco-fred-sofiane-frontend.onrender.com'];

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cors({
        origin: allowedOrigins
    }));


    app.setGlobalPrefix('api');

    await app.listen(3000);
}

bootstrap().then(() => {
    consola.success('Server is running on http://localhost:3000');
}).catch((err) => {
    consola.error(err);
});
