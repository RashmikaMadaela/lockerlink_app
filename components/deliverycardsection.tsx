import { Delivery } from "@/types";
import { Text, View } from "react-native";
import "../global.css";
import DeliveryCard from "./deliverycard";

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
      {deliveries.map((delivery) => (
        <DeliveryCard key={delivery.id} {...delivery} />
      ))}
    </View>
  );
}
