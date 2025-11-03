import { it, expectTypeOf } from 'vitest'
import type { Protocol } from 'playwright-core/types/protocol'
import { createTestPasskey } from '../index'

it('returns the credential object that can be used with Playwright as-is', () => {
  const { credential } = createTestPasskey({ rpId: 'example.com' })

  expectTypeOf(credential).toExtend<
    Pick<
      Protocol.WebAuthn.Credential,
      'credentialId' | 'rpId' | 'privateKey' | 'signCount'
    >
  >()
})
