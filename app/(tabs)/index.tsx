import AddDeliveryModal from "@/components/adddeliverymodal";
import CircleButton from "@/components/circlebutton";
import DeliveryCardSection from "@/components/deliverycardsection";
import StatSection from "@/components/statsection";
import {
  subscribeToDeliveries,
  subscribeToSlots,
  subscribeToTelemetry,
} from "@/firebase/db";
import { Delivery, SlotStatus, Telemetry } from "@/types";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import "../../global.css";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [slots, setSlots] = useState<Record<string, SlotStatus>>({});

  useEffect(() => {
    const unsubDeliveries = subscribeToDeliveries(setDeliveries);
    const unsubTelemetry = subscribeToTelemetry(setTelemetry);
    const unsubSlots = subscribeToSlots(setSlots);
    return () => {
      unsubDeliveries();
      unsubTelemetry();
      unsubSlots();
    };
  }, []);

  const pendingCount = deliveries.filter((d) => d.status === "pending").length;
  const totalSlots = Math.max(Object.keys(slots).length, 2);
  const occupiedCount = Object.values(slots).filter((s) => s.occupied).length;

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
              data={telemetry ? `${telemetry.battery}%` : "--"}
              icon="battery-std"
              color="#10b981"
            />
            <StatSection
              title="Occupied"
              data={`${occupiedCount}/${totalSlots}`}
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
              data={telemetry ? `${telemetry.temperature}°C` : "--"}
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
      />
    </View>
  );
}
