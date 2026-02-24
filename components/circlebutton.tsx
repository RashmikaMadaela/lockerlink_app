import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, View } from "react-native";
import "../global.css";

type Props = {
  onPress: () => void;
};

export default function CircleButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="active:scale-95"
      style={{
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      }}
    >
      <View
        className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full items-center justify-center bg-yellow-400"
        style={{ width: 64, height: 64 }}
      >
        <MaterialIcons name="add" size={32} color="#fff" />
      </View>
    </Pressable>
  );
}
