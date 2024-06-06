import { jest } from '@jest/globals';

jest.mock('ioredis', () => require('ioredis-mock'));
