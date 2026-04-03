import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import "../global.css";
import OTPModal from "./otpmodal";

type Props = {
  id: string;
  slotId: string;
  title?: string;
  status?: "pending" | "delivered" | "picked-up";
  otp?: string;
  onDelete?: (delivery: { id: string; otp: string; slotId: string }) => void;
};

export default function DeliveryCard({
  id,
  slotId,
  title = "Package Delivery",
  status = "pending",
  otp = "1234",
  onDelete,
}: Props) {
  const [showOTPModal, setShowOTPModal] = useState(false);
  const canRevealOtp = /^\d{4}$/.test(otp);
  const statusConfig = {
    pending: {
      color: "#f59e0b",
      bg: "#fef3c7",
      text: "Pending Pickup",
      icon: "schedule" as const,
    },
    delivered: {
      color: "#10b981",
      bg: "#d1fae5",
      text: "Delivered",
      icon: "check-circle" as const,
    },
    "picked-up": {
      color: "#6b7280",
      bg: "#f3f4f6",
      text: "Picked Up",
      icon: "done-all" as const,
    },
  };

  const config = statusConfig[status];

  return (
    <>
      <Pressable
        onPress={() => {
          if (canRevealOtp) setShowOTPModal(true);
        }}
        onLongPress={() => {
          Alert.alert("Delete delivery", `Remove \"${title}\"?`, [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => onDelete?.({ id, otp, slotId }),
            },
          ]);
        }}
        delayLongPress={350}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <View className="p-4 mb-3 bg-white border border-gray-100 shadow-md rounded-2xl">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">{title}</Text>
            </View>
            <View
              className="p-2 rounded-full"
              style={{ backgroundColor: config.bg }}
            >
              <MaterialIcons
                name={config.icon}
                size={24}
                color={config.color}
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: config.bg }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: config.color }}
              >
                {config.text}
              </Text>
            </View>
          </View>

          {status === "pending" && (
            <View className="pt-3 mt-3 border-t border-gray-100">
              <View className="flex-row items-center justify-center">
                <MaterialIcons name="touch-app" size={16} color="#3b82f6" />
                <Text className="ml-2 text-sm font-medium text-blue-500">
                  {canRevealOtp
                    ? "Tap to view OTP"
                    : "OTP is shown only when created"}
                </Text>
              </View>
              <Text className="mt-1 text-xs text-center text-gray-400">
                Long press to delete
              </Text>
            </View>
          )}
        </View>
      </Pressable>

      {canRevealOtp ? (
        <OTPModal
          visible={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          otp={otp}
          title={title}
        />
      ) : null}
    </>
  );
}
