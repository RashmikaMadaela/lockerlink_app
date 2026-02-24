import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";
import "../global.css";

type Props = {
  action?: "opened" | "closed" | "delivery" | "pickup";
  timestamp?: string;
};

export default function LogCard({
  action = "opened",
  timestamp = "10/02 10:27 AM",
}: Props) {
  const actionConfig = {
    opened: {
      icon: "lock-open" as const,
      color: "#3b82f6",
      bg: "#dbeafe",
      text: "Door Opened",
    },
    closed: {
      icon: "lock" as const,
      color: "#6b7280",
      bg: "#f3f4f6",
      text: "Door Closed",
    },
    delivery: {
      icon: "move-to-inbox" as const,
      color: "#10b981",
      bg: "#d1fae5",
      text: "Package Delivered",
    },
    pickup: {
      icon: "outbox" as const,
      color: "#f59e0b",
      bg: "#fef3c7",
      text: "Package Picked Up",
    },
  };

  const config = actionConfig[action];

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
      <View className="flex-row items-center">
        <View
          className="rounded-full p-3 mr-4"
          style={{ backgroundColor: config.bg }}
        >
          <MaterialIcons name={config.icon} size={24} color={config.color} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-800 mb-1">
            {config.text}
          </Text>
          <View className="flex-row items-center">
            <MaterialIcons name="schedule" size={14} color="#9ca3af" />
            <Text className="text-sm text-gray-500 ml-1">{timestamp}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
