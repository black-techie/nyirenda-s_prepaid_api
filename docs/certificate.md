#run this code on node to generate private and public pfx files


const { execSync } = require('child_process');

const alias = 'mow';
const password = 'mowmajis';

function runCommand(command) {
    try {
        execSync(command);
        console.log(`Command executed successfully: ${command}`);
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        console.error(error.stderr ? error.stderr.toString() : error.stdout.toString());
    }
}

// Step 1: Generate Key Pair and Create JKS
runCommand(`keytool -genkeypair -keystore test_new.jks -alias ${alias} -storepass ${password} -keypass ${password} -keyalg RSA -keysize 2048 -validity 365 -dname "CN=ORG, OU=Operations, O=,L=Dar Es Salaam, S=TZ, C=Tanzania"`);

// Step 2: Import JKS into PKCS#12 (PFX)
runCommand(`keytool -importkeystore -srckeystore test_new.jks -destkeystore testPrivateKey.pfx -srcstoretype JKS -deststoretype PKCS12 -deststorepass ${password} -srcalias ${alias} -destalias ${alias} -srcstorepass ${password}`);

// Step 3: Copy PKCS#12 to create public-only version
runCommand('cp testPrivateKey.pfx testPublicKey.pfx');

// Step 4: Export Public Certificate from JKS
runCommand(`keytool -export -keystore test_new.jks -alias ${alias} -file public.cer -storepass ${password}`);

// Step 5: Export Private Key Certificate from PKCS#12
runCommand(`keytool -export -keystore testPrivateKey.pfx -alias ${alias} -file privatekey.cer -storepass ${password}`);

// Step 6: Delete Private Key from Public-only PKCS#12
runCommand(`keytool -delete -alias ${alias} -keystore testPublicKey.pfx -storepass ${password}`);

// Step 7: Import Public Certificate into Public-only PKCS#12
runCommand(`keytool -import -trustcacerts -alias ${alias} -file public.cer -keystore testPublicKey.pfx -storepass ${password}`);

console.log('Task completed successfully.');
