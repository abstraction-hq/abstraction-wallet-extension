import { Hex, keccak256 } from "viem"

// salt and iv lengths
const SALT_LENGTH = 16
const IV_LENGTH = 12

async function deriveKey(
	password: string,
	salt: BufferSource,
	keyUsages: KeyUsage[]
) {
	const passwordKey = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		"PBKDF2",
		false,
		["deriveKey"]
	)

	const key = await crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt,
			iterations: 250000,
			hash: "SHA-256"
		},
		passwordKey,
		{ name: "AES-GCM", length: 256 },
		false,
		keyUsages
	)

	return key
}

export async function encryptMnemonic(mnemonic: string, password: string): Promise<string> {
	// generate iv and salt for later usage
	const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
	const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))

	// derive key for encryption
	const key = await deriveKey(password, salt, ["encrypt"])

	// encrypt data
	const encrypted = await crypto.subtle.encrypt(
		{
			name: "AES-GCM",
			iv
		},
		key,
		new TextEncoder().encode(JSON.stringify(mnemonic))
	)
	const data = new Uint8Array(encrypted)

	// construct the encrypted data + info that we need for decryption
	const buffer = new Uint8Array(
		// encrypted data + iv + salt
		iv.byteLength + salt.byteLength + data.byteLength
	)

	// add data to the buffer
	buffer.set(iv, 0)
	buffer.set(salt, iv.byteLength)
	buffer.set(data, iv.byteLength + salt.byteLength)

	// create a string from the full data + info
	const base64 = btoa(String.fromCharCode.apply(null, [...buffer]))
	return base64
}

export async function decryptMnemonic(encryptedMnemonic: string, password: string) {
	// re-construct buffer of data + info for decryption
	const buffer = Uint8Array.from(atob(encryptedMnemonic), (c) => c.charCodeAt(0))

	// get salt, iv and data
	const iv = buffer.slice(0, IV_LENGTH)
	const salt = buffer.slice(IV_LENGTH, IV_LENGTH + SALT_LENGTH)
	const data = buffer.slice(IV_LENGTH + SALT_LENGTH)

	// derive key for decryption
	const key = await deriveKey(password, salt, ["decrypt"])

	// decrypt data
	const decrypted = await crypto.subtle.decrypt(
		{
			name: "AES-GCM",
			iv
		},
		key,
		data
	)

	// construct JWK
	const mnemonic: string = JSON.parse(new TextDecoder().decode(decrypted))

	return mnemonic
}

export function hashPassword(password: string): Hex {
	return keccak256(Uint8Array.from(password.split('').map(letter => letter.charCodeAt(0))))
}