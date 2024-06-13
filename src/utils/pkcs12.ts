import * as crypto from 'crypto';
import fs from 'fs';
import forge from 'node-forge';

class loadPfx {
    public safeContents: any;
    constructor(pfxPath: string, pfxPassword: string) {
        const pfxFile = fs.readFileSync(pfxPath, 'binary');
        const pfxAsn1 = forge.asn1.fromDer(pfxFile);
        const pfx = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, false, pfxPassword);
        this.safeContents = pfx.safeContents;
    }
}

class extractPublicAndPrivateKey {
    public privateKey: string = '';
    public publicKey: string = '';
    constructor(pfx: loadPfx) {
        for (const safeContents of pfx.safeContents) {
            for (const safeBag of safeContents.safeBags) {
                if (
                    safeBag.type === forge.pki.oids.keyBag ||
                    safeBag.type === forge.pki.oids.pkcs8ShroudedKeyBag
                ) {
                    this.privateKey = forge.pki.privateKeyToPem(safeBag.key);
                } else if (safeBag.type === forge.pki.oids.certBag) {
                    this.publicKey = forge.pki.publicKeyToPem(safeBag.cert.publicKey);
                }
            }
        }
    }
}

class pkcs12 {
    private privateKey: string;
    private publicKey: string;
    constructor(privateKey: extractPublicAndPrivateKey) {
        this.privateKey = privateKey.privateKey;
        this.publicKey = privateKey.publicKey;
    }

    public sign(body: object) {
        const signer =  crypto.createSign("RSA-SHA1");
        signer.write(JSON.stringify(body));
        signer.end();
        const signature = signer.sign(this.privateKey, 'base64');
        return signature;
    }

    public verify(signatureBase64: string, body: object) {
        const signatureBytes = forge.util.decode64(signatureBase64);
        const md = forge.md.sha256.create();
        md.update(JSON.stringify(body), 'utf8');
        const publicKey = forge.pki.publicKeyFromPem(this.publicKey);
        const verified = publicKey.verify(md.digest().bytes(), signatureBytes);
        return verified;
    }

    encryptWithPublicKey(data: string) {
        const md = forge.md.sha256.create();
        md.update(JSON.stringify(data), 'utf8');
        const publicKey = forge.pki.publicKeyFromPem(this.publicKey);
        const encrypted = publicKey.encrypt(md.digest().bytes());
        return forge.util.encode64(encrypted);
    }

    decryptWithPrivateKey(encryptedData: string) {
        const encryptedBytes = forge.util.decode64(encryptedData);
        const privateKey = forge.pki.privateKeyFromPem(this.privateKey);
        const decryptedBytes = privateKey.decrypt(encryptedBytes);
        const decryptedMessage = forge.util.decodeUtf8(decryptedBytes);
        return decryptedMessage;
    }
}

export default new pkcs12(
    new extractPublicAndPrivateKey(
        new loadPfx('./src/certificates/privateKey.pfx', "bh.Sh137#%12")
    )
);

