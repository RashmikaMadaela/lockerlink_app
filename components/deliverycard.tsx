import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, Text, View } from "react-native";
import "../global.css";

type Props = {
  title?: string;
  status?: "pending" | "delivered" | "picked-up";
  otp?: string;
  lockerNumber?: number;
  timestamp?: string;
};

export default function DeliveryCard({
  title = "Package Delivery",
  status = "pending",
  otp = "1234",
  lockerNumber = 5,
  timestamp = "2 hours ago",
}: Props) {
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
    <Pressable
      onPress={() => alert(`OTP: ${otp}\nLocker: #${lockerNumber}`)}
      className="active:opacity-70"
    >
      <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800">{title}</Text>
            <Text className="text-sm text-gray-500">{timestamp}</Text>
          </View>
          <View
            className="rounded-full p-2"
            style={{ backgroundColor: config.bg }}
          >
            <MaterialIcons name={config.icon} size={24} color={config.color} />
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialIcons name="inbox" size={18} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-2">
              Locker #{lockerNumber}
            </Text>
          </View>
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
          <View className="mt-3 pt-3 border-t border-gray-100">
            <View className="flex-row items-center justify-center">
              <MaterialIcons name="touch-app" size={16} color="#3b82f6" />
              <Text className="text-sm text-blue-500 font-medium ml-2">
                Tap to view OTP
              </Text>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}
