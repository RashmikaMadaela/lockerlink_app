import AddDeliveryModal from "@/components/adddeliverymodal";
import CircleButton from "@/components/circlebutton";
import DeliveryCardSection from "@/components/deliverycardsection";
import StatSection from "@/components/statsection";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import "../../global.css";

type Delivery = {
  title: string;
  status: "pending" | "delivered" | "picked-up";
  otp: string;
  description?: string;
  coolingNeeded?: boolean;
};

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      title: "Electronics Package",
      status: "pending",
      otp: "1234",
    },
    {
      title: "Amazon Delivery",
      status: "pending",
      otp: "5678",
    },
    {
      title: "Food Delivery",
      status: "delivered",
      otp: "9012",
    },
    {
      title: "Clothing Package",
      status: "pending",
      otp: "3456",
    },
  ]);

  const handleAddDelivery = (newDelivery: {
    title: string;
    description: string;
    coolingNeeded: boolean;
    otp: string;
  }) => {
    const delivery: Delivery = {
      title: newDelivery.title,
      status: "pending",
      otp: newDelivery.otp,
      description: newDelivery.description,
      coolingNeeded: newDelivery.coolingNeeded,
    };

    setDeliveries([delivery, ...deliveries]);
  };

  const pendingCount = deliveries.filter((d) => d.status === "pending").length;

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View className="p-4">
          <Text className="text-sm font-semibold text-gray-500 mb-3 ml-1">
            OVERVIEW
          </Text>
          <View
            className="flex-row flex-wrap justify-center"
            style={{ gap: 12 }}
          >
            <StatSection
              title="Battery"
              data="87%"
              icon="battery-std"
              color="#10b981"
            />
            <StatSection
              title="Occupied"
              data={`1/2`}
              icon="lock-clock"
              color="#3b82f6"
            />
            <StatSection
              title="Pending"
              data={pendingCount}
              icon="local-shipping"
              color="#f59e0b"
            />
            <StatSection
              title="Temperature"
              data="24°C"
              icon="thermostat"
              color="#ef4444"
            />
          </View>
        </View>

        {/* Active Deliveries Section */}
        <View className="px-4 pb-24">
          <Text className="text-sm font-semibold text-gray-500 mb-3 ml-1">
            ACTIVE DELIVERIES
          </Text>
          <DeliveryCardSection deliveries={deliveries} />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircleButton onPress={() => setModalVisible(true)} />
      </View>

      {/* Add Delivery Modal */}
      <AddDeliveryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddDelivery}
      />
    </View>
  );
}
