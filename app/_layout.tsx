import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function RootGuard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuth = (segments[0] as string) === "(auth)";
    if (!user && !inAuth) {
      router.replace("/(auth)/login" as any);
    } else if (user && inAuth) {
      router.replace("/");
    }
  }, [user, loading, router, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootGuard />
    </AuthProvider>
  );
}
