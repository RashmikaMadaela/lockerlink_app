import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import "../global.css";

type Props = {
  visible: boolean;
  onClose: () => void;
  otp: string;
  title?: string;
};

export default function OTPModal({
  visible,
  onClose,
  otp,
  title = "Package Delivery",
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-3xl m-4"
          style={{ width: "85%", maxWidth: 400 }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="items-center pt-6 pb-4 px-6">
            <View
              className="rounded-full p-4 mb-4"
              style={{ backgroundColor: "#dbeafe" }}
            >
              <MaterialIcons name="lock-open" size={40} color="#3b82f6" />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              Access Code
            </Text>
            <Text className="text-sm text-gray-500 text-center">{title}</Text>
          </View>

          {/* OTP Display */}
          <View className="px-6 pb-6">
            <View className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 mb-4">
              <Text className="text-xs font-semibold text-gray-500 text-center mb-2">
                YOUR OTP CODE
              </Text>
              <View className="flex-row justify-center items-center mb-1">
                {otp.split("").map((digit, index) => (
                  <View
                    key={index}
                    className="bg-white rounded-xl mx-1 items-center justify-center border-2 border-blue-400"
                    style={{ width: 50, height: 60 }}
                  >
                    <Text className="text-3xl font-bold text-gray-800">
                      {digit}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Copy Button */}
            <Pressable
              onPress={handleCopy}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View
                className="rounded-xl p-4 items-center flex-row justify-center mb-4"
                style={{
                  backgroundColor: copied ? "#10b981" : "#3b82f6",
                }}
              >
                <MaterialIcons
                  name={copied ? "check" : "content-copy"}
                  size={20}
                  color="#fff"
                />
                <Text className="text-white text-base font-bold ml-2">
                  {copied ? "Copied!" : "Copy OTP"}
                </Text>
              </View>
            </Pressable>

            {/* Close Button */}
            <Pressable
              onPress={onClose}
              style={({ pressed }) => ({
                opacity: pressed ? 0.6 : 1,
                marginTop: 12,
              })}
            >
              <View className="items-center">
                <Text className="text-gray-600 text-base font-semibold">
                  Close
                </Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
