import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import consola from "consola";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('Api messagerie backend')
        .setDescription('The API description')
        .setVersion('1.0')
        .addTag('messagerie')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}

bootstrap().then(() => {
    consola.success('Server is running on http://localhost:3000');
}).catch((err) => {
    console.error(err);
});
