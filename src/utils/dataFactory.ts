import { faker } from '@faker-js/faker';

export function getRandomIP() {
    return faker.internet.ipv4();
}

