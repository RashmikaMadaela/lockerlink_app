import { auth } from "@/firebaseconfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import "../../global.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // AuthContext onAuthStateChanged triggers the redirect
    } catch (e: any) {
      const code: string = e?.code ?? "";
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 justify-center px-6">
        {/* Header */}
        <View className="items-center mb-10">
          <View className="bg-blue-600 rounded-3xl p-5 mb-4">
            <Text className="text-4xl">🔒</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-800">LockerLink</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Sign in to manage your locker
          </Text>
        </View>

        {/* Form card */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          {error ? (
            <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <Text className="text-sm text-red-600 text-center">{error}</Text>
            </View>
          ) : null}

          <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 text-base text-gray-800"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          <Text className="text-sm font-medium text-gray-700 mb-1">
            Password
          </Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl mb-6">
            <TextInput
              className="flex-1 px-4 py-3 text-base text-gray-800"
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable
              onPress={() => setShowPassword((v) => !v)}
              className="px-3"
              hitSlop={8}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={22}
                color="#9ca3af"
              />
            </Pressable>
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className="bg-blue-600 rounded-xl py-4 items-center active:opacity-80"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold">
                Sign In
              </Text>
            )}
          </Pressable>
        </View>

        {/* Register link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-sm text-gray-500">Don’t have an account? </Text>
          <Pressable onPress={() => router.push("/(auth)/register" as any)}>
            <Text className="text-sm text-blue-600 font-semibold">
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
