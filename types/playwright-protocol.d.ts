declare module 'playwright-core/types/protocol' {
  /**
   * Minimal ambient declaration for Playwright's protocol types used in tests.
   *
   * This file intentionally provides a permissive, small subset of the real
   * Playwright `Protocol.WebAuthn` types so test-time type imports like:
   *
   *   import type { Protocol } from 'playwright-core/types/protocol'
   *
   * succeed without depending on Playwright's internal .d.ts shape.
   *
   * If you need more precise types later, replace or extend these declarations
   * with the matching shapes from the Playwright version you use.
   */

  export namespace Protocol {
    export namespace WebAuthn {
      // Common primitive used for binary payloads in Playwright protocol.
      export type Binary = string | Uint8Array | ArrayBuffer

      // WebAuthn credential response (registration or assertion).
      export interface CredentialResponse {
        // Attestation response fields (for create)
        clientDataJSON?: Binary
        attestationObject?: Binary
        // Assertion response fields (for get)
        authenticatorData?: Binary
        signature?: Binary
        userHandle?: Binary | null
      }

      // A simplified credential object compatible with Playwright's protocol usage.
      // Kept permissive to accept the shapes produced by helper functions in tests.
      export interface Credential {
        // Base64 or raw identifier for the credential
        id: string
        // Raw id bytes (Playwright often sends/receives this as base64 or binary)
        rawId?: Binary
        // Credential type, typically "public-key"
        type: 'public-key' | string
        // Optional transports supported by the authenticator
        transports?: string[]
        // The actual response payload containing attestation/assertion bytes
        response: CredentialResponse
        // Optional authenticator metadata (optional / implementation specific)
        authenticator?: {
          // For example: "internal" | "platform" | "cross-platform"
          attachment?: string
          // Whether the authenticator is resident
          residentKey?: boolean
          // Whether the authenticator is a user-verifying platform authenticator
          isUserVerified?: boolean
        } | null
      }

      // Small helper types that Playwright's protocol sometimes uses
      export interface MakeCredentialParameters {
        rpId: string
        // Other fields omitted for brevity
        [key: string]: any
      }

      export interface GetAssertionParameters {
        rpId: string
        // Other fields omitted for brevity
        [key: string]: any
      }
    }
  }
}
