import CircleButton from "@/components/circlebutton";
import StatSection from "@/components/statsection";
import { View } from "react-native";

export default function Home() {
  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatSection title="Battery" data="40%" icon="battery-std" />
        <StatSection title="Occupied Lockers" data="8" icon="lock-clock" />
        <StatSection
          title="Remaining Deliveries"
          data="4"
          icon="delivery-dining"
        />
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 30,
          left: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircleButton onPress={() => console.log("Pressed circle button")} />
      </View>
    </>
  );
}
