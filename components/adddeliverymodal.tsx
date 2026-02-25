import { addDelivery } from "@/firebase/db";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import "../global.css";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AddDeliveryModal({ visible, onClose }: Props) {
  const [deliveryName, setDeliveryName] = useState("");
  const [description, setDescription] = useState("");
  const [coolingNeeded, setCoolingNeeded] = useState(false);
  const [errors, setErrors] = useState({ deliveryName: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const resetForm = () => {
    setDeliveryName("");
    setDescription("");
    setCoolingNeeded(false);
    setErrors({ deliveryName: "" });
    setSubmitError("");
  };

  const handleSubmit = async () => {
    if (!deliveryName.trim()) {
      setErrors({ deliveryName: "Delivery name is required" });
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const result = await addDelivery({
      title: deliveryName.trim(),
      description: description.trim(),
      coolingNeeded,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error ?? "Failed to add delivery.");
      return;
    }

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl" style={{ maxHeight: "85%" }}>
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-800">
              New Delivery
            </Text>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </Pressable>
          </View>
          <ScrollView>
            <View className="p-6">
              {/* Delivery Name */}
              <View className="mb-5">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Delivery Name <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={deliveryName}
                  onChangeText={(text) => {
                    setDeliveryName(text);
                    if (errors.deliveryName) {
                      setErrors({ deliveryName: "" });
                    }
                  }}
                  placeholder="e.g., Amazon Package, Food Delivery"
                  className="bg-gray-50 border border-gray-300 rounded-xl p-4 text-base text-gray-800"
                  placeholderTextColor="#9ca3af"
                />
                {errors.deliveryName ? (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.deliveryName}
                  </Text>
                ) : null}
              </View>

              {/* Description */}
              <View className="mb-5">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Description
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Additional details (optional)"
                  multiline
                  numberOfLines={3}
                  className="bg-gray-50 border border-gray-300 rounded-xl p-4 text-base text-gray-800"
                  style={{ minHeight: 80, textAlignVertical: "top" }}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Cooling Needed */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between bg-gray-50 border border-gray-300 rounded-xl p-4">
                  <View className="flex-row items-center flex-1">
                    <MaterialIcons
                      name="ac-unit"
                      size={24}
                      color="#3b82f6"
                      style={{ marginRight: 12 }}
                    />
                    <View>
                      <Text className="text-base font-semibold text-gray-800">
                        Cooling Required
                      </Text>
                      <Text className="text-sm text-gray-500">
                        Use temperature-controlled locker
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={coolingNeeded}
                    onValueChange={setCoolingNeeded}
                    trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
                    thumbColor={coolingNeeded ? "#3b82f6" : "#f3f4f6"}
                  />
                </View>
              </View>

              {/* Submit error */}
              {submitError ? (
                <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <View className="flex-row items-center">
                    <MaterialIcons
                      name="error"
                      size={18}
                      color="#ef4444"
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-sm text-red-700 flex-1">
                      {submitError}
                    </Text>
                  </View>
                </View>
              ) : null}

              {/* Info Box */}
              <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <View className="flex-row items-start">
                  <MaterialIcons
                    name="info"
                    size={20}
                    color="#3b82f6"
                    style={{ marginRight: 8, marginTop: 2 }}
                  />
                  <View className="flex-1">
                    <Text className="text-sm text-blue-900 font-medium mb-1">
                      Automatic Assignment
                    </Text>
                    <Text className="text-xs text-blue-700">
                      A 4-digit OTP and locker number will be automatically
                      generated for this delivery.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View className="p-6 border-t border-gray-200">
            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={({ pressed }) => ({
                opacity: pressed || isSubmitting ? 0.7 : 1,
              })}
            >
              <View className="bg-blue-500 rounded-xl p-4 mb-4 items-center flex-row justify-center">
                {isSubmitting ? (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                ) : null}
                <Text className="text-white text-base font-bold">
                  {isSubmitting ? "Adding..." : "Add Delivery"}
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => ({
                opacity: pressed ? 0.6 : 1,
                marginTop: 12,
              })}
            >
              <View className="items-center">
                <Text className="text-gray-600 text-base font-semibold">
                  Cancel
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
