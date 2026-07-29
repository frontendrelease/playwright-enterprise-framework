import { mergeTests, mergeExpects } from '@playwright/test'
import { test as authTest } from './auth.fixture'
import { test as apiTest } from './api-helpers.fixture'
import { test as dataTest } from './test-data.fixture'
import { expect as baseExpect } from '@playwright/test'

export const test = mergeTests(authTest, apiTest, dataTest)
export const expect = mergeExpects(baseExpect)
