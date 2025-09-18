/**
 * Main application entry point for Time Warp Backend
 *
 * This file bootstraps a NestJS application with the following features:
 * - CORS configuration for cross-origin requests
 * - Global validation pipes for request data validation
 * - Environment variable configuration
 * - Server startup and port binding
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Bootstrap function that initializes and starts the NestJS application
 *
 * Sets up the following configurations:
 * - CORS policy for allowed origins
 * - Global validation pipes with whitelist and transform options
 * - Server port binding (defaults to 3000 if not specified)
 */
async function bootstrap() {
  // Create NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Configure server port from environment variable or default to 3000
  const port = process.env.PORT || 3000;

  // Configure allowed CORS origins from environment variable or use defaults
  const corsOrigins = process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3001', // Local frontend development server
    'https://time-warp-rxs7.vercel.app', // Production frontend URL
  ];

  // Enable CORS with specific configuration
  app.enableCors({
    origin: corsOrigins, // Allowed origins for cross-origin requests
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers)
  });

  // Configure global validation pipe for all incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );

  // Global exception filter can be enabled if needed
  // app.useGlobalFilters(new HttpExceptionFilter());

  // Start the server and bind to the specified port
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}

// Start the application
void bootstrap();
