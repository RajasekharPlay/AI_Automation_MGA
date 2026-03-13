import { mergeTests } from '@playwright/test';
import { test as skyeAttributesFixture } from '../fixtures/SkyeAttributesFixture';
import { mga_test as mgaCommandsFixture } from '../fixtures/MGACommandsFixture';
import { geolocationFixture } from "./GeoLocationFixtures";

export const test = mergeTests(
    skyeAttributesFixture,
    mgaCommandsFixture,
    geolocationFixture
);