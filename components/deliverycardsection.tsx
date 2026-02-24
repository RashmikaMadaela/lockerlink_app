import { Text, View } from "react-native";
import "../global.css";
import DeliveryCard from "./deliverycard";

export default function DeliveryCardSection() {
  const deliveries = [
    {
      title: "Electronics Package",
      status: "pending" as const,
      otp: "1234",
      lockerNumber: 5,
      timestamp: "2 hours ago",
    },
    {
      title: "Amazon Delivery",
      status: "pending" as const,
      otp: "5678",
      lockerNumber: 8,
      timestamp: "4 hours ago",
    },
    {
      title: "Food Delivery",
      status: "delivered" as const,
      otp: "9012",
      lockerNumber: 3,
      timestamp: "6 hours ago",
    },
    {
      title: "Clothing Package",
      status: "pending" as const,
      otp: "3456",
      lockerNumber: 11,
      timestamp: "1 day ago",
    },
  ];

  if (deliveries.length === 0) {
    return (
      <View className="items-center justify-center py-12">
        <Text className="text-gray-400 text-base">No active deliveries</Text>
      </View>
    );
  }

  return (
    <View className="flex flex-col w-full">
      {deliveries.map((delivery, index) => (
        <DeliveryCard key={index} {...delivery} />
      ))}
    </View>
  );
}
