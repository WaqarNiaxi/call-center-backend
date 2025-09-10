// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//  app.enableCors({
//     // origin: '*',
//       origin: 'http://localhost:3000', 
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: 'Content-Type, Authorization',
//   });


//   // Swagger config
//   const config = new DocumentBuilder()
//     .setTitle('Call Center API')
//     .setDescription('API documentation for the call center system')
//     .setVersion('1.0')
//     .addBearerAuth() // Optional: if you're using JWT auth
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document); // Swagger will be available at /api

//   await app.listen(process.env.PORT ?? 4000);
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Server } from 'http';

let cachedServer: Server;

export async function bootstrap(): Promise<Server> {
  if (cachedServer) {
    return cachedServer;
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Allow all origins (update later if needed)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Call Center API')
    .setDescription('API documentation for the call center system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const server = await app.listen(0); // Listen on a random available port
  cachedServer = server;

  return server;
}
