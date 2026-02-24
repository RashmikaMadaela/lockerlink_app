import CircleButton from "@/components/circlebutton";
import DeliveryCardSection from "@/components/deliverycardsection";
import StatSection from "@/components/statsection";
import { ScrollView, Text, View } from "react-native";
import "../../global.css";

export default function Home() {
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
              data="8/12"
              icon="lock-clock"
              color="#3b82f6"
            />
            <StatSection
              title="Pending"
              data="4"
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
          <DeliveryCardSection />
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
        <CircleButton onPress={() => alert("Add new delivery")} />
      </View>
    </View>
  );
}
