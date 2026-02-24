import { Text, View } from "react-native";
import "../global.css";
import DeliveryCard from "./deliverycard";

type Delivery = {
  title: string;
  status: "pending" | "delivered" | "picked-up";
  otp: string;
  description?: string;
  coolingNeeded?: boolean;
};

type Props = {
  deliveries: Delivery[];
};

export default function DeliveryCardSection({ deliveries }: Props) {
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
