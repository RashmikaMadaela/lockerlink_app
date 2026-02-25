import { sendCommand } from "@/firebase/db";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import "../../global.css";

type SettingItemProps = {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  color?: string;
  showArrow?: boolean;
};

function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
  color = "#6b7280",
  showArrow = true,
}: SettingItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 active:opacity-70"
    >
      <View className="flex-row items-center">
        <View
          className="rounded-full p-3 mr-4"
          style={{ backgroundColor: color + "20" }}
        >
          <MaterialIcons name={icon} size={24} color={color} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-800">{title}</Text>
          {subtitle && (
            <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
          )}
        </View>
        {showArrow && (
          <MaterialIcons name="chevron-right" size={24} color="#d1d5db" />
        )}
      </View>
    </Pressable>
  );
}

export default function Settings() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* User Profile Section */}
        <View className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 mb-6 items-center bg-blue-600">
          <View className="bg-white rounded-full p-4 mb-3">
            <MaterialIcons name="person" size={40} color="#3b82f6" />
          </View>
          <Text className="text-xl font-bold text-white mb-1">Heshan</Text>
          <Text className="text-sm text-blue-100">Smart Locker Manager</Text>
        </View>

        {/* Quick Actions */}
        <Text className="text-sm font-semibold text-gray-500 mb-3 ml-1">
          QUICK ACTIONS
        </Text>
        <SettingItem
          icon="lock-open"
          title="Open All Doors"
          subtitle="Emergency access to all lockers"
          onPress={() =>
            Alert.alert(
              "Open All Doors",
              "This will unlock every locker compartment. Continue?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Open All",
                  style: "destructive",
                  onPress: () => sendCommand("openAll", true),
                },
              ],
            )
          }
          color="#ef4444"
        />
        <SettingItem
          icon="refresh"
          title="Reset System"
          subtitle="Restart locker system"
          onPress={() =>
            Alert.alert(
              "Reset System",
              "This will restart the locker device. Continue?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Reset",
                  style: "destructive",
                  onPress: () => sendCommand("reset", true),
                },
              ],
            )
          }
          color="#f59e0b"
        />

        {/* Settings */}
        <Text className="text-sm font-semibold text-gray-500 mt-4 mb-3 ml-1">
          SETTINGS
        </Text>
        <SettingItem
          icon="notifications"
          title="Notifications"
          subtitle="Manage notification preferences"
          onPress={() => alert("Notifications settings")}
          color="#8b5cf6"
        />
        <SettingItem
          icon="wifi"
          title="Network Settings"
          subtitle="Configure WiFi and connectivity"
          onPress={() => alert("Network settings")}
          color="#06b6d4"
        />
        <SettingItem
          icon="lock"
          title="Security"
          subtitle="Password and authentication"
          onPress={() => alert("Security settings")}
          color="#10b981"
        />
        <SettingItem
          icon="storage"
          title="Storage"
          subtitle="Manage locker configurations"
          onPress={() => alert("Storage settings")}
          color="#f59e0b"
        />

        {/* About */}
        <Text className="text-sm font-semibold text-gray-500 mt-4 mb-3 ml-1">
          ABOUT
        </Text>
        <SettingItem
          icon="info"
          title="About LockerLink"
          subtitle="Version 1.0.0"
          onPress={() => alert("LockerLink v1.0.0")}
          color="#6b7280"
        />
        <SettingItem
          icon="help"
          title="Help & Support"
          subtitle="Get help and contact support"
          onPress={() => alert("Help & Support")}
          color="#6b7280"
        />

        {/* Logout */}
        <Pressable
          onPress={() => alert("Logging out...")}
          className="bg-red-50 rounded-2xl p-4 mt-4 mb-8 border border-red-100 active:opacity-70"
        >
          <View className="flex-row items-center justify-center">
            <MaterialIcons name="logout" size={20} color="#ef4444" />
            <Text className="text-base font-semibold text-red-500 ml-2">
              Logout
            </Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}
