import { claimDevice, createUserProfile, getDevice } from "@/firebase/db";
import { auth } from "@/firebaseconfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import "../../global.css";

const TOTAL_STEPS = 3;

function StepIndicator({ current }: { current: number }) {
  return (
    <View className="flex-row items-center justify-center mb-8">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View key={i} className="flex-row items-center">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              i + 1 <= current ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                i + 1 <= current ? "text-white" : "text-gray-400"
              }`}
            >
              {i + 1}
            </Text>
          </View>
          {i < TOTAL_STEPS - 1 && (
            <View
              className={`w-10 h-0.5 mx-1 ${
                i + 1 < current ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );
}

function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <View className="p-3 mb-4 border border-red-200 bg-red-50 rounded-xl">
      <Text className="text-sm text-center text-red-600">{message}</Text>
    </View>
  );
}

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [step1Error, setStep1Error] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Step 2
  const [deviceId, setDeviceId] = useState("");
  const [devicePin, setDevicePin] = useState("");
  const [step2Error, setStep2Error] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Step 3
  const [consent, setConsent] = useState(false);
  const [step3Error, setStep3Error] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Step 1 ───────────────────────────────────────────────────────────────
  const handleStep1 = () => {
    setStep1Error("");
    if (!name.trim()) return setStep1Error("Full name is required.");
    if (!email.trim()) return setStep1Error("Email is required.");
    if (!/\S+@\S+\.\S+/.test(email))
      return setStep1Error("Enter a valid email address.");
    if (password.length < 6)
      return setStep1Error("Password must be at least 6 characters.");
    if (password !== confirmPw) return setStep1Error("Passwords do not match.");
    setStep(2);
  };

  // ── Step 2 — verify device against RTDB ─────────────────────────────────
  const handleStep2 = async () => {
    setStep2Error("");
    if (!deviceId.trim()) return setStep2Error("Device ID is required.");
    if (!devicePin.trim()) return setStep2Error("Device PIN is required.");

    setVerifying(true);
    try {
      const cleanId = deviceId.trim().toUpperCase();
      const cleanPin = devicePin.trim().toUpperCase();
      const device = await getDevice(cleanId);

      if (!device) {
        return setStep2Error(
          "Device ID not found. Check the label on your locker.",
        );
      }
      if (device.pin !== cleanPin) {
        return setStep2Error("Incorrect PIN. Check the label on your locker.");
      }
      if (device.claimed) {
        return setStep2Error(
          "This device is already linked to another account.",
        );
      }
      setStep(3);
    } catch {
      setStep2Error(
        "Verification failed. Check your connection and try again.",
      );
    } finally {
      setVerifying(false);
    }
  };

  // ── Step 3 — create account ──────────────────────────────────────────────
  const handleSubmit = async () => {
    setStep3Error("");
    if (!consent)
      return setStep3Error("You must accept the terms to continue.");

    setSubmitting(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const uid = credential.user.uid;
      const cleanId = deviceId.trim().toUpperCase();

      await claimDevice(cleanId, uid);
      await createUserProfile(uid, {
        name: name.trim(),
        email: email.trim(),
        deviceId: cleanId,
        consentAccepted: true,
        createdAt: Date.now(),
      });
      // AuthContext onAuthStateChanged handles the redirect to (tabs)
    } catch (e: any) {
      const code: string = e?.code ?? "";
      if (code === "auth/email-already-in-use") {
        setStep3Error("An account with this email already exists.");
      } else {
        setStep3Error("Registration failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}
        <Pressable
          onPress={() => (step > 1 ? setStep(step - 1) : router.back())}
          className="mb-6"
        >
          <Text className="font-medium text-blue-600">← Back</Text>
        </Pressable>

        <Text className="mb-1 text-2xl font-bold text-gray-800">
          Create Account
        </Text>
        <Text className="mb-6 text-sm text-gray-500">
          {step === 1 && "Enter your account details."}
          {step === 2 && "Link your locker device."}
          {step === 3 && "Review and confirm."}
        </Text>

        <StepIndicator current={step} />

        <View className="p-6 bg-white border border-gray-100 shadow-sm rounded-3xl">
          {/* ── STEP 1: Account Details ──────────────────────────────────── */}
          {step === 1 && (
            <>
              <ErrorBanner message={step1Error} />

              <Text className="mb-1 text-sm font-medium text-gray-700">
                Full Name
              </Text>
              <TextInput
                className="px-4 py-3 mb-4 text-base text-gray-800 border border-gray-200 bg-gray-50 rounded-xl"
                placeholder="John Smith"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
              />

              <Text className="mb-1 text-sm font-medium text-gray-700">
                Email
              </Text>
              <TextInput
                className="px-4 py-3 mb-4 text-base text-gray-800 border border-gray-200 bg-gray-50 rounded-xl"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />

              <Text className="mb-1 text-sm font-medium text-gray-700">
                Password
              </Text>
              <View className="flex-row items-center mb-4 border border-gray-200 bg-gray-50 rounded-xl">
                <TextInput
                  className="flex-1 px-4 py-3 text-base text-gray-800"
                  placeholder="At least 6 characters"
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

              <Text className="mb-1 text-sm font-medium text-gray-700">
                Confirm Password
              </Text>
              <View className="flex-row items-center mb-6 border border-gray-200 bg-gray-50 rounded-xl">
                <TextInput
                  className="flex-1 px-4 py-3 text-base text-gray-800"
                  placeholder="Re-enter password"
                  secureTextEntry={!showConfirmPw}
                  value={confirmPw}
                  onChangeText={setConfirmPw}
                />
                <Pressable
                  onPress={() => setShowConfirmPw((v) => !v)}
                  className="px-3"
                  hitSlop={8}
                >
                  <MaterialIcons
                    name={showConfirmPw ? "visibility" : "visibility-off"}
                    size={22}
                    color="#9ca3af"
                  />
                </Pressable>
              </View>

              <Pressable
                onPress={handleStep1}
                className="items-center py-4 bg-blue-600 rounded-xl active:opacity-80"
              >
                <Text className="text-base font-semibold text-white">Next</Text>
              </Pressable>
            </>
          )}

          {/* ── STEP 2: Device Verification ──────────────────────────────── */}
          {step === 2 && (
            <>
              <View className="p-4 mb-5 border border-blue-100 bg-blue-50 rounded-xl">
                <Text className="text-sm leading-5 text-center text-blue-700">
                  Find the <Text className="font-bold">Device ID</Text> and{" "}
                  <Text className="font-bold">PIN</Text> printed on the label
                  attached to your locker device.
                </Text>
              </View>

              <ErrorBanner message={step2Error} />

              <Text className="mb-1 text-sm font-medium text-gray-700">
                Device ID
              </Text>
              <TextInput
                className="px-4 py-3 mb-4 text-base tracking-widest text-gray-800 border border-gray-200 bg-gray-50 rounded-xl"
                placeholder="e.g. LL-DEMO-01"
                autoCapitalize="characters"
                autoCorrect={false}
                value={deviceId}
                onChangeText={setDeviceId}
              />

              <Text className="mb-1 text-sm font-medium text-gray-700">
                Device PIN
              </Text>
              <TextInput
                className="px-4 py-3 mb-6 text-base tracking-widest text-gray-800 border border-gray-200 bg-gray-50 rounded-xl"
                placeholder="e.g. AB-1234"
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={7}
                value={devicePin}
                onChangeText={setDevicePin}
              />

              <Pressable
                onPress={handleStep2}
                disabled={verifying}
                className="items-center py-4 bg-blue-600 rounded-xl active:opacity-80"
              >
                {verifying ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-base font-semibold text-white">
                    Verify Device
                  </Text>
                )}
              </Pressable>
            </>
          )}

          {/* ── STEP 3: Consent & Submit ──────────────────────────────────── */}
          {step === 3 && (
            <>
              <ErrorBanner message={step3Error} />

              {/* Summary */}
              <View className="p-4 mb-5 border border-gray-200 bg-gray-50 rounded-xl">
                <Text className="mb-2 text-sm font-semibold text-gray-700">
                  Account Summary
                </Text>
                <Text className="text-sm text-gray-600">
                  Name:{" "}
                  <Text className="font-medium text-gray-800">{name}</Text>
                </Text>
                <Text className="mt-1 text-sm text-gray-600">
                  Email:{" "}
                  <Text className="font-medium text-gray-800">{email}</Text>
                </Text>
                <Text className="mt-1 text-sm text-gray-600">
                  Device:{" "}
                  <Text className="font-medium text-gray-800">
                    {deviceId.toUpperCase()}
                  </Text>
                </Text>
              </View>

              {/* Consent checkbox */}
              <Pressable
                onPress={() => setConsent(!consent)}
                className="flex-row items-start mb-6 active:opacity-70"
              >
                <View
                  className={`w-5 h-5 rounded border-2 mr-3 mt-0.5 items-center justify-center flex-shrink-0 ${
                    consent
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {consent && (
                    <Text className="text-xs font-bold text-white">✓</Text>
                  )}
                </View>
                <Text className="flex-1 text-sm leading-5 text-gray-600">
                  I authorise LockerLink to accept and manage deliveries on my
                  behalf using the linked locker device, and I agree to the
                  terms of service.
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                disabled={submitting}
                className="items-center py-4 bg-blue-600 rounded-xl active:opacity-80"
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-base font-semibold text-white">
                    Create Account
                  </Text>
                )}
              </Pressable>
            </>
          )}
        </View>

        {/* Sign in link (only on step 1) */}
        {step === 1 && (
          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-gray-500">
              Already have an account?{" "}
            </Text>
            <Pressable onPress={() => router.replace("/(auth)/login" as any)}>
              <Text className="text-sm font-semibold text-blue-600">
                Sign In
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
