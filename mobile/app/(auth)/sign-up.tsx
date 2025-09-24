import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { styles } from "@/assets/styles/auth.styles.js";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err: any) {
      console.error("Sign up error:", err);
      
      // Check if err has errors array with safer property access
      if (err && typeof err === 'object' && 'errors' in err && Array.isArray(err.errors) && err.errors.length > 0) {
        const firstError = err.errors[0];
        
        if (firstError && typeof firstError === 'object' && 'code' in firstError) {
          if (firstError.code === "form_identifier_exists") {
            setError("That email address is already in use. Please try another.");
            return;
          }
        }
        
        // Check for message in first error
        if (firstError && typeof firstError === 'object' && 'message' in firstError) {
          setError(String(firstError.message));
          return;
        }
        
        // Check for longMessage in first error
        if (firstError && typeof firstError === 'object' && 'longMessage' in firstError) {
          setError(String(firstError.longMessage));
          return;
        }
      }
      
      // Check if err has a message property directly
      if (err && typeof err === 'object' && 'message' in err) {
        setError(String(err.message));
        return;
      }
      
      // Log additional error info for debugging
      console.error("Error keys:", err ? Object.keys(err) : 'null');
      
      // Fallback error message
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded || isVerifying) return;

    setIsVerifying(true);
    setError("");

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error("Sign up attempt incomplete:", JSON.stringify(signUpAttempt, null, 2));
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      // Better error logging - handle the fact that err might not have expected structure
      console.error("Verification error:", err);
      
      // Check if err has a message property
      if (err && typeof err === 'object' && 'message' in err) {
        console.error("Error message:", err.message);
      }
      
      // Check if err has errors array
      if (err && typeof err === 'object' && 'errors' in err && Array.isArray(err.errors)) {
        console.error("Error array:", err.errors);
        
        // Check first error in array
        if (err.errors.length > 0) {
          const firstError = err.errors[0];
          console.error("First error:", firstError);
          
          // Check for code property
          if (firstError && typeof firstError === 'object' && 'code' in firstError) {
            console.error("Error code:", firstError.code);
            
            // Handle specific error codes
            if (firstError.code === "form_code_incorrect") {
              setError("Invalid verification code. Please check and try again.");
              return;
            } else if (firstError.code === "verification_expired") {
              setError("Verification code has expired. Please request a new one.");
              return;
            }
          }
          
          // Check for longMessage property
          if (firstError && typeof firstError === 'object' && 'longMessage' in firstError) {
            console.error("Error long message:", firstError.longMessage);
            setError(String(firstError.longMessage));
            return;
          }
          
          // Check for message property in first error
          if (firstError && typeof firstError === 'object' && 'message' in firstError) {
            setError(String(firstError.message));
            return;
          }
        }
      }
      
      // Check if it's a network error or other type
      if (err && typeof err === 'object' && 'name' in err) {
        console.error("Error name:", err.name);
      }
      
      // Log the full error object properties
      console.error("Error keys:", err ? Object.keys(err) : 'null');
      console.error("Error constructor:", err ? err.constructor.name : 'null');
      
      // Fallback error message
      setError("Verification failed. Please check your code and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle resending verification code
  const onResendPress = async () => {
    if (!isLoaded) return;
    
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setError(""); // Clear any existing errors
      // Optionally show a success message
    } catch (err: any) {
      console.error("Resend error:", err);
      setError("Failed to resend code. Please try again.");
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.verificationInput, error && styles.errorInput]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#9A8478"
          onChangeText={(code) => setCode(code)}
        />

        <TouchableOpacity 
          onPress={onVerifyPress} 
          style={[styles.button, isVerifying && { opacity: 0.6 }]}
          disabled={isVerifying}
        >
          <Text style={styles.buttonText}>
            {isVerifying ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={onResendPress} 
          style={[styles.button, { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary || '#007AFF', marginTop: 10 }]}
        >
          <Text style={[styles.buttonText, { color: COLORS.primary || '#007AFF' }]}>Resend Code</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View style={styles.container}>
        <Image source={require("../../assets/images/revenue-i2.png")} style={styles.illustration} />

        <Text style={styles.title}>Create Account</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholderTextColor="#9A8478"
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && { opacity: 0.6 }]} 
          onPress={onSignUpPress}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}