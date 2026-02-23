import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  data: any;
  icon: any;
};

export default function StatSection({ title, data, icon }: Props) {
  return (
    <View style={styles.statContainer}>
      <View style={styles.stat}>
        <MaterialIcons name={icon} size={38} color="#25292e" />
        <Text>{title}</Text>
        <Text>{data}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statContainer: {
    width: 250,
    height: 120,
    marginHorizontal: 60,
    marginVertical: 10,
    borderWidth: 4,
    borderColor: "#ffd33d",
    borderRadius: 10,
    padding: 3,
  },
  stat: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
});
