# Test Passkey

Create [WebAuthn Passkeys](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API) for testing your applications.

## Usage

```sh
npm i test-passkey
```

This library has been designed primarily to help with creating passkeys as a part of your test setup. For example, here's how you can use it to test that users can sign in into your application with passkeys using Playwright:

```ts
import { createTestPasskey } from 'test-passkey'
import { test, expect } from '@playwright/test'

test('authenticates using a passkey', async ({ page }) => {
  // Create a test passkey.
  const passkey = createTestPasskey({
    rpId: 'localhost'
  })

  // Store the passkey (public) on the server.
  // This association is freeform and is entirely up to you.
  const user = await db.user.create({ /* ... */ })
  const passkeyRecord = await db.passkey.create({
    id: passkey.credential.credentialId,
    publicKey: passkey.publicKey,
    userId: user.id,
  })

  // Store the passkey (private) on the client.
  const client = await page.context().newCDPSession(page)
	await client.send('WebAuthn.enable')
	const { authenticatorId } = await client.send('WebAuthn.addVirtualAuthenticator', {
		options: {
			protocol: 'ctap2',
			transport: 'internal',
			hasResidentKey: true,
			hasUserVerification: true,
			isUserVerified: true,
			automaticPresenceSimulation: true,
		},
	})
	await client.send('WebAuthn.addCredential', {
		authenticatorId,
		credential: {
			...passkey.credential,
			isResidentCredential: true,
			userName: user.username,
			userHandle: btoa(user.id),
			userDisplayName: user.name ?? user.email,
		},
	})

  // ...the rest of your authentication test.
})
```

> See [Chrome Developer Protocol API](https://playwright.dev/docs/api/class-cdpsession) in Playwright.
