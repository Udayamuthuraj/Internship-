import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;

import java.security.Key;

public class SecretKeyGenerator {
    public static void main(String[] args) {
        // Generate a secure random key (256 bits, suitable for HS256 algorithm)
        Key key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);

        // Encode the key to a Base64 string
        String base64Key = Encoders.BASE64.encode(key.getEncoded());

        System.out.println("Generated JWT Secret Key (Base64 Encoded):");
        System.out.println(base64Key);
    }
}