import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";
import "../global.css";

type Props = {
  title: string;
  data: string | number;
  icon: any;
  color?: string;
};

export default function StatSection({
  title,
  data,
  icon,
  color = "#ffd33d",
}: Props) {
  return (
    <View
      className="bg-white rounded-2xl p-4 m-2"
      style={{ width: 160, minHeight: 140 }}
    >
      <View className="items-center justify-center flex-1">
        <View
          className="rounded-full p-3 mb-3"
          style={{ backgroundColor: color + "20" }}
        >
          <MaterialIcons name={icon} size={32} color={color} />
        </View>
        <Text className="text-3xl font-bold text-gray-800 mb-1">{data}</Text>
        <Text className="text-xs text-gray-500 text-center font-medium">
          {title}
        </Text>
      </View>
    </View>
  );
}
