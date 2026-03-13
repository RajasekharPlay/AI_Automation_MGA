import { mergeTests } from '@playwright/test';
import { test as skyeAttributesFixture } from '../fixtures/SkyeAttributesFixture';
import { banorte_test as banorteCommandsFixture } from '../fixtures/BanorteCommandsFixture';
import { geolocationFixture } from "./GeoLocationFixtures";

export const test = mergeTests(
    skyeAttributesFixture,
    banorteCommandsFixture,
    geolocationFixture
);