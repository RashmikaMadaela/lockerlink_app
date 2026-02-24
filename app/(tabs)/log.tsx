import LogCard from "@/components/logcard";
import { ScrollView, Text, View } from "react-native";
import "../../global.css";

export default function History() {
  const logs = [
    {
      action: "pickup" as const,
      timestamp: "Today 10:27 AM",
    },
    {
      action: "delivery" as const,
      timestamp: "Today 08:15 AM",
    },
    {
      action: "opened" as const,
      timestamp: "Yesterday 06:45 PM",
    },
    {
      action: "closed" as const,
      timestamp: "Yesterday 06:46 PM",
    },
    {
      action: "delivery" as const,
      timestamp: "Yesterday 02:30 PM",
    },
    {
      action: "pickup" as const,
      timestamp: "Yesterday 11:20 AM",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <Text className="text-sm font-semibold text-gray-500 mb-3 ml-1">
            RECENT ACTIVITY
          </Text>
          {logs.map((log, index) => (
            <LogCard key={index} {...log} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
